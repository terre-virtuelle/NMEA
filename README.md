# NMEA
Decodage zt passage en JSON des phrases NMEA0183 à l'aide de ANTLR4
# Java -- ANTLR4 {#java-antlr4 .unnumbered}

Antlr4 (version 4.13.1), peut à présent générer des parseurs pour une
dizaine de langages.Cet outil est écrit en Java, il convient d'avoir
installé Java, version 1.8 ou plus, sur votre machine.

## Télécharger les classes Java : `antlr-4.13.1-complete.jar` {#télécharger-les-classes-java-antlr-4.13.1-complete.jar .unnumbered}

<https://www.antlr.org/download.html>.

## Copier cette archive dans un répertoire, ex : `/usr/local/lib` {#copier-cette-archive-dans-un-répertoire-ex-usrlocallib .unnumbered}

     cp antlr-4.13.1-complete.jar /usr/local/lib/ 

## Modifier le fichier `.bashrc` {#modifier-le-fichier-.bashrc .unnumbered}

     export CLASSPATH=".:/usr/local/lib/antlr-4.13.1-complete.jar:$CLASSPATH"
     
     alias antlr4='java -Xmx500M -cp "/usr/local/lib/antlr-4.13.1-complete.jar:$CLASSPATH" 
     org.antlr.v4.Tool'

# Node -- ANTLR4 {#node-antlr4 .unnumbered}

## Vérifier votre version de Node {#vérifier-votre-version-de-node .unnumbered}

    $ node -v
    v20.5.1

## Installer la dernière version si nécessaire {#installer-la-dernière-version-si-nécessaire .unnumbered}

## Créer le répertoire du projet {#créer-le-répertoire-du-projet .unnumbered}

    $ mkdir NMEA
    $ cd NMEA

## Créer le fichier `package.json` {#créer-le-fichier-package.json .unnumbered}

    $ npm init
    $ more  package.json
    {
      "name": "nmea",
      "version": "1.0.0",
      "description": "Parser des phrases NMEA",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "Serge",
      "license": "ISC",
      "dependencies": {
        "antlr4": "^4.13.1",
      },
    }

## Installer le runtime `antlr4` {#installer-le-runtime-antlr4 .unnumbered}

    $ npm i antlr4

## Modifier le fichier `package.json` pour les modules ES6 {#modifier-le-fichier-package.json-pour-les-modules-es6 .unnumbered}

    package.json
    {
      "name": "nmea",
      "version": "1.0.0",
      "description": "Parser des phrases NMEA",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "Serge",
      "license": "ISC",
      "dependencies": {
        "antlr4": "^4.13.1",
      },
      "type": "module"
    }

## Ecrire la grammaire : NMEA.g4 {#ecrire-la-grammaire-nmea.g4 .unnumbered}

    grammar NMEA;


    nmea 
        : (sentence | EMPTY_LINE )* EOF
        ;
    sentence :  
            (aam | dbt | gga | gll | gsa | gsv | hdt | mwv | rmc | rsa | vhw | vtg | xdr)
            ;

     /** AAM - Waypoint Arrival Alarm */
    aam     :
            DEVICE 'AAM'  SEP
            (LETTERS)* SEP
            (LETTERS)* SEP
            NUMBER* SEP
            (LETTERS)* SEP
            (LETTERS | NUMBER)*
            CHECKSUM
            ;
    /** DBT - Depth Below Transducer, value expressed in feet, metres and fathoms. */ 
    dbt     :
            DEVICE 'DBT'  SEP
            (SEP | (NUMBER SEP))
             LETTERS SEP
        (SEP | (NUMBER SEP))
            LETTERS SEP
        (SEP | (NUMBER SEP))
            LETTERS
            CHECKSUM
             ;
             ......

## Le répertoire du projet : {#le-répertoire-du-projet .unnumbered}

     node_modules  package.json  package-lock.json  NMEA.g4

## Générer le parser {#générer-le-parser .unnumbered}

    $ antlr4 -Dlanguage=JavaScript NMEA.g4

## Le répertoire du projet : {#le-répertoire-du-projet-1 .unnumbered}

    NMEA.g4  
    package.json  package-lock.json node_modules

    NMEALexer.interp  NMEALexer.tokens  NMEA.tokens
    NMEAParser.js  NMEALexer.js    
       
    NMEAListener.js   

## Le fichier `NMEAListener.js (extrait)` {#le-fichier-nmealistener.js-extrait .unnumbered}

    // Generated from NMEA.g4 by ANTLR 4.13.1
    // jshint ignore: start
    import antlr4 from 'antlr4';

    // This class defines a complete listener for a parse tree produced by NMEAParser.
    export default class NMEAListener extends antlr4.tree.ParseTreeListener {

        // Enter a parse tree produced by NMEAParser#nmea.
        enterNmea(ctx) {
        }

        // Exit a parse tree produced by NMEAParser#nmea.
        exitNmea(ctx) {
        }


        // Enter a parse tree produced by NMEAParser#sentence.
        enterSentence(ctx) {
        }

        // Exit a parse tree produced by NMEAParser#sentence.
        exitSentence(ctx) {
        }


        // Enter a parse tree produced by NMEAParser#aam.
        enterAam(ctx) {
        }

    ......

## Ecriture de `index.js` {#ecriture-de-index.js .unnumbered}

    import { createServer } from 'http';
    import antlr4 from 'antlr4';
    const {CommonTokenStream, InputStream} = antlr4;
    import NMEALexer from './NMEALexer.js';
    import NMEAParser from './NMEAParser.js';
    import HtmlNMEAListener from './HtmlNMEAListener.js';
    import fs from 'fs';

    createServer((req, res) => {

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.write('<html><head><meta charset="UTF-8"/></head><body>');

        var input;
        try {
           // input = fs.readFileSync('./nmea.txt', 'utf8');
            input = fs.readFileSync('./TramesVirvoiles.txt', 'utf8');
        } catch (err) {
            console.error(err);
        }

        var chars = new InputStream(input, true);
        var lexer = new NMEALexer(chars);
        var tokens = new CommonTokenStream(lexer);
        var parser = new NMEAParser(tokens);

        parser.buildParseTrees = true;
        var tree = parser.nmea();
        var htmlNmea = new HtmlNMEAListener(res);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(htmlNmea, tree);

        res.write('</body></html>');
        res.end();

    }).listen(4000);

## Ecriture de HtmlNMEAListener.js {#ecriture-de-htmlnmealistener.js .unnumbered}

    import antlr4 from 'antlr4';
    import NMEALexer from './NMEALexer.js';
    import MNEAParser from './NMEAParser.js';
    import NMEAListener  from './NMEAListener.js';
    import { latConvert, lonConvert, degConvert, ewConvert} from './convert.js';
    ('./convert.js');
    export default class HtmlNMEAListener extends NMEAListener {
        constructor(res) {
            super();
            this.Res = res;
            this.index = -1;
            this.nmea = {
                "sentences": []
            };
        }

        // Exit a parse tree produced by NMEAParser#nmea.
        exitNmea(ctx) {
            this.Res.write(JSON.stringify(this.nmea));
        }

        /** AAM - Waypoint Arrival Alarm */
        enterAam(ctx) {
            var tab = this.header(ctx);
            this.nmea.sentences[this.index].arrivalCircleEntered = tab[1];
            this.nmea.sentences[this.index].perpendicularPassed = tab[2];
            this.nmea.sentences[this.index].circleRadius = parseFloat(tab[3]);
            this.nmea.sentences[this.index].unit = tab[4];
            var t = tab[5].split('*');
            this.nmea.sentences[this.index].wptId = t[0];
            this.nmea.sentences[this.index].cheksum = t[1];
        }

        /** DBT - Depth Below Transducer */
        enterDbt(ctx) {
            var tab = this.header(ctx);
            this.nmea.sentences[this.index].depthInFeet = parseFloat(tab[1]);
            this.nmea.sentences[this.index].unitf = tab[2];
            this.nmea.sentences[this.index].depthInMeters = parseFloat(tab[3]);
            this.nmea.sentences[this.index].unitM = tab[4];
            this.nmea.sentences[this.index].depthInFathoms = parseFloat(tab[5]);
            var t = tab[6].split('*');
            this.nmea.sentences[this.index].unitF = t[0];
            this.nmea.sentences[this.index].cheksum = t[1];
        }
        .....

## Exécution {#exécution .unnumbered}

    $ node index.js

## Résultat le fichier JSON des commandes {#résultat-le-fichier-json-des-commandes .unnumbered}

    {
        "sentences": [{
                "s": "$GPRMC,011112,A,3528.487,N,02156.479,E,0.4216686,183.6485,081023,0,W,A*2C",
                "dev": "GP",
                "id": "RMC",
                "utc": "011112",
                "status": "A",
                "lat": 35.474783333333335,
                "lon": 21.941316666666662,
                "sog": 0.4216686,
                "track": 183.6485,
                "ddmmyy": "081023",
                "magneticVariation": 0,
                "nsew": "A",
                "cheksum": "2C"
            }, {
                "s": "$GPMWV,282.6257,R,19.57921,N,A*24",
                "dev": "GP",
                "id": "MWV",
                "windAngle": 282.6257,
                "reference": null,
                "windSpeed": 19.57921,
                "unit": "N",
                "status": "A",
                "cheksum": "24"
            }

# Contacts {#contacts .unnumbered}

[`sergemorvan29@gmail.com`](mailto:sergemorvan29@gmail.com)
[`paul.dominique.marques@gmail.com`](mailto:paul.dominique.marques@gmail.com)

[]{#fin label="fin"}
