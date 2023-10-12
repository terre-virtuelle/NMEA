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

    /** GGA - essential fix data which provide 3D location and accuracy data */
    enterGga(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].utc = tab[1];
        var latitude = tab[2];
        var ns = tab[3];
        var lat = latConvert(latitude != null ? parseFloat(latitude) : 0.0, ns != null ? ns : "");
        this.nmea.sentences[this.index].lat = lat;
        var longitude = tab[4];
        var ew = tab[5];
        var lon = lonConvert(longitude != null ? parseFloat(longitude) : 0.0, ew != null ? ew : "");
        this.nmea.sentences[this.index].lon = lon;
        this.nmea.sentences[this.index].gpsQualityIndicator = tab[6];
        this.nmea.sentences[this.index].numberOfSatellitesInView = tab[7];
        this.nmea.sentences[this.index].horizontalDilutionOfPrecision = tab[8];
        this.nmea.sentences[this.index].geoidAltitude = tab[9];
        this.nmea.sentences[this.index].unitsOfGeoidAltitude = tab[10];
        this.nmea.sentences[this.index].cheksum = tab[12];
    }

    /** GLL : Geographic position, Latitude and Longitude */
    enterGll(ctx) {
        var tab = this.header(ctx);
        var latitude = tab[1];
        var ns = tab[2];
        var lat = latConvert(latitude != null ? parseFloat(latitude) : 0.0, ns != null ? ns : "");
        this.nmea.sentences[this.index].lat = lat;
        var longitude = tab[3];
        var ew = tab[4];
        var lon = lonConvert(longitude != null ? parseFloat(longitude) : 0.0, ew != null ? ew : "");
        this.nmea.sentences[this.index].lon = lon;
        this.nmea.sentences[this.index].utc = tab[5];
        this.nmea.sentences[this.index].status = tab[6];
        var l = tab[7].split('*');
        this.nmea.sentences[this.index].cheksum = l[1];
    }

    /** GSA : Satellite status */
    enterGsa(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].dimensionFix = tab[1];
        var satTab = [];
        for (var i = 2; i < 15; i++) {
            if (tab[i] != null && tab [i] !== '00' && tab [i] !== '') {
                satTab.push(tab[i]);
            }
        }
        this.nmea.sentences[this.index].PRNOfSatellitesUsed = satTab;
        this.nmea.sentences[this.index].PDOP = tab[15];
        this.nmea.sentences[this.index].HDOP = tab[16];
        this.nmea.sentences[this.index].cheksum = tab[19];
        var t = tab[17].split('*');
        this.nmea.sentences[this.index].VDOP = t[0];
        this.nmea.sentences[this.index].cheksum = t[1];
    }

    /** GSV : Satellites in view */
    enterGsv(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].numberOfSentences = tab[1] !== null ? parseInt(tab[1]) : 0;
        this.nmea.sentences[this.index].sentenceNumber = tab[2] !== null ? parseInt(tab[2]) : 0;
        this.nmea.sentences[this.index].numberOfSatellitesInView = tab[3] !== null ? parseInt(tab[3]) : 0;
        this.nmea.sentences[this.index].GPSSatellites = [];

        var l = tab.length / 4;
        l *= 4;
        var snr = tab[i + 3];
        for (var i = 4; i < l; i += 4) {
            var satellite = {};
            if (snr !== null && snr !== "" && snr !== " ") {
                satellite.satellitePRNNumber = tab[i] !== null ? parseInt(tab[i]) : 0;
                satellite.elevationDegrees = tab[i + 1] !== null ? parseInt(tab[i + 1]) : 0;
                satellite.azimuthDegrees = tab[i + 2] !== null ? parseInt(tab[i + 2]) : 0;
                satellite.snr = tab[i + 3] !== null ? parseInt(tab[i + 3]) : 0;
                this.nmea.sentences[this.index].GPSSatellites.push(satellite);
            }
        }
        var t = tab[tab.length - 1].split('*');
        this.nmea.sentences[this.index].cheksum = t[1];
    }

    /** HDT - Heading, True */
    enterHdt(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].heading = tab[1];
        var m = tab[2].split('*');
        this.nmea.sentences[this.index].true = m[0];
        this.nmea.sentences[this.index].cheksum = m[1];
    }

    /** MWV - Wind Speed and Angle */
    enterMwv(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].windAngle = parseFloat(tab[1]);
        this.nmea.sentences[this.index].reference = parseFloat(tab[2]);
        this.nmea.sentences[this.index].windSpeed = parseFloat(tab[3]);
        this.nmea.sentences[this.index].unit = tab[4];
        var m = tab[5].split('*');
        this.nmea.sentences[this.index].status = m[0];
        this.nmea.sentences[this.index].cheksum = m[1];
    }

    /** RMC : Recommended Minimum sentence C */
    enterRmc(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].utc = tab[1];
        this.nmea.sentences[this.index].status = tab[2];
        var latitude = tab[3];
        var ns = tab[4];
        var lat = latConvert(latitude != null ? parseFloat(latitude) : 0.0, ns != null ? ns : "");
        this.nmea.sentences[this.index].lat = lat;
        var longitude = tab[5];
        var ew = tab[6];
        var lon = lonConvert(longitude != null ? parseFloat(longitude) : 0.0, ew != null ? ew : "");
        this.nmea.sentences[this.index].lon = lon;
        this.nmea.sentences[this.index].sog = parseFloat(tab[7]);
        this.nmea.sentences[this.index].track = parseFloat(tab[8]);
        this.nmea.sentences[this.index].ddmmyy = tab[9];
        this.nmea.sentences[this.index].magneticVariation = parseFloat(tab[10]);
        var magT = tab[tab.length - 1].split('*');
        this.nmea.sentences[this.index].nsew = magT[0];
        this.nmea.sentences[this.index].cheksum = magT[1];
    }

    /** RSA - Rudder Sensor Angle  */
    enterRsa(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].starboard = parseFloat(tab[1]);
        this.nmea.sentences[this.index].statusstarboard = tab[2];
        this.nmea.sentences[this.index].port = tab[3];
        var magT = tab[tab.length - 1].split('*');
        this.nmea.sentences[this.index].statusPort = parseFloat(magT[0]);
        this.nmea.sentences[this.index].cheksum = magT[1];
    }
    /**VHW : Water Speed and Heading */
    enterVhw(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].degreesTrue = parseFloat(tab[1]);
        this.nmea.sentences[this.index].unitDeg = tab[2];
        this.nmea.sentences[this.index].degreesMagnetic = parseFloat(tab[3]);
        this.nmea.sentences[this.index].unitMag = tab[4];
        this.nmea.sentences[this.index].speedInKnots = parseFloat(tab[5]);
        this.nmea.sentences[this.index].unitKnt = tab[6];
        this.nmea.sentences[this.index].speedInKilometers = parseFloat(tab[7]);
        var m = tab[8].split('*');
        this.nmea.sentences[this.index].unitK = m[0];
        this.nmea.sentences[this.index].cheksum = m[1];
    }

    /** VTG - Course Over Ground and Ground Speed */
    enterVtg(ctx) {
        var tab = this.header(ctx);
        this.nmea.sentences[this.index].cog = parseFloat(tab[1]);
        this.nmea.sentences[this.index].true = tab[2];
        this.nmea.sentences[this.index].cogMagn = parseFloat(tab[3]);
        this.nmea.sentences[this.index].mag = tab[4];
        this.nmea.sentences[this.index].sogKnt = parseFloat(tab[5]);
        this.nmea.sentences[this.index].knots = tab[6];
        this.nmea.sentences[this.index].sogKm_hr = parseFloat(tab[7]);
        this.nmea.sentences[this.index].k = tab[8];
        var m = tab[9].split('*');
        this.nmea.sentences[this.index].mode = m[0];
        this.nmea.sentences[this.index].cheksum = m[1];

    }

    /** XDR - Transducer Measurements */
    enterXdr(ctx) {
        var tab = this.header(ctx);
        var l = (tab.length - 1) / 4;
        var j = 1;
        this.nmea.sentences[this.index].values = [];
        for (var i = 0; i < l - 1; i++) {
            var v = {};
            v.type = tab[j];
            v.value = parseFloat(tab[j + 1]);
            v.unit = tab[j + 2];
            v.id = tab[j + 3];
            this.nmea.sentences[this.index].values.push(v);
            j += 4;
        }
        var v = {};
        v.type = tab[j];
        v.value = parseFloat(tab[j + 1]);
        v.unit = tab[j + 2];
        var m = tab[j + 3].split('*');
        v.id = m[0];
        this.nmea.sentences[this.index].values.push(v);
        this.nmea.sentences[this.index].cheksum = m[1];
    }
    header(ctx) {
        this.index++;
        this.nmea.sentences.push({});
        var tab = ctx.getText().split(',');
        this.nmea.sentences[this.index].s = ctx.getText();
        this.nmea.sentences[this.index].dev = tab[0].substring(1, 3);
        this.nmea.sentences[this.index].id = tab[0].substring(3, 8);
        return tab;
    }
}
	