// Funktion von der Webseite zum Verarbeiten von get-Parametern in der URL
// https://ekiwi.de/index.php/1749/javascript-get-parameter-aus-url-auslesen/
function getUrlParam(name) {
    var url_string = window.location;
    var url = new URL(url_string);
    var c = url.searchParams.get(name);
    return c;
}

function debug_info(out) {
    if (debug) {
        console.log(out);
    }
}

// ******************* Funktionen zur Verwendung von Cookies
/**
 * setzt ein Cookie
 * @param {String} cname name des Cookies 
 * @param {String} cvalue Wert des Cookies
 * @param {Integer} exdays Tage für die es erhalten bleibt 
 */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * liest das Cookie mit dem Namen cname
 * @param {String} cname name des Cookies
 * @returns String - Wert des Cookies
 */
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}