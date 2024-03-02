// Funktion von der Webseite zum Verarbeiten von get-Parametern in der URL
// https://ekiwi.de/index.php/1749/javascript-get-parameter-aus-url-auslesen/
function getUrlParam(name) {
    var url_string = window.location;
    var url = new URL(url_string);
    var c = url.searchParams.get(name);
    return c;
}

function debug_info(out) {
    if (typeof (debug) === 'bolean' && debug) {
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
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
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

// ****** Funktionen zum Vergleich ******
const isDeepEqual = (object1, object2) => {

    const objKeys1 = Object.keys(object1);
    const objKeys2 = Object.keys(object2);
  
    if (objKeys1.length !== objKeys2.length) {
        console.log("Lenght of Objekt differs",JSON.stringify(object1));
        return false;
    }
  
    for (var key of objKeys1) {
      const value1 = object1[key];
      const value2 = object2[key];
  
      const isObjects = isObject(value1) && isObject(value2);
  
      if ((isObjects && !isDeepEqual(value1, value2)) ||
        (!isObjects && value1 !== value2)
      ) {
        if (!isObjects) {
            console.log("Values differ:",value1,value2);
        } else {
            console.log("objects differ:", JSON.stringify(value1), JSON.stringify(value2));
        }
        return false;
      }
    }
    return true;
  };
  
  const isObject = (object) => {
    return object != null && typeof object === "object";
  };
 