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
        input = fs.readFileSync('./nmea.txt', 'utf8');
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

