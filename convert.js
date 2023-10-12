

export  function latConvert(latitude, ns) {
    var latitudeInt = parseInt(latitude / 100);
    var latitudeMin = latitude - (latitudeInt * 100);
    var latDeg = latitudeInt + (latitudeMin / 60);
    if (ns.includes("S")) {
        latDeg *= -1;
    }
    return latDeg;
}

export function lonConvert(longitude, ew) {
    var longitudeInt = parseInt(longitude / 100);
    var longitudeMin = longitude - (longitudeInt * 100);
    var lonDeg = longitudeInt + (longitudeMin / 60);
    if (ew.includes("W")) {
        lonDeg *= -1;
    }
    return lonDeg;
}

export   function degConvert(latlon) {
    var latlonMin = latlon / 10000;
    var latlonDeg = latlonMin / 60;
    return latlonDeg;
}

export  function ewConvert(variation, ew) {
    if (ew.includes("W")) {
        variation *= -1;
    }
    return variation;
}


