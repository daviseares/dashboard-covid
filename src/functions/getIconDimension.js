import { Icon } from "leaflet";


export default function getIconDimension(value) {
    var w;
    var h;

    if (value > 15000) {
        w = 30;
        h = 30;
    }else if (value > 9000) {
        w = 28;
        h = 28; 
    }else if (value > 4000) {
        w = 26;
        h = 26;
    } else if (value > 2000) {
        w = 24;
        h = 24;
    } else if (value > 1000) {
        w = 22;
        h = 22;
    } else if (value > 500) {
        w = 19;
        h = 19;
    } else if (value > 200) {
        w = 17;
        h = 17;
    } else if (value > 100) {
        w = 15;
        h = 15;
    }
    else if (value > 50) {
        w = 13;
        h = 13;
    } else if (value > 20) {
        w = 9;
        h = 9;
    }
    else {
        w = 7;
        h = 7;
    }
    var customMarkup = new Icon({
        iconUrl: require('../icons/circle.svg'),
        iconSize: [w, h],
        popupAnchor: [0, -35],
    })

    return customMarkup;
}