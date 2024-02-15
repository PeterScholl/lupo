// Funktion von der Webseite zum Verarbeiten von get-Parametern in der URL
// https://ekiwi.de/index.php/1749/javascript-get-parameter-aus-url-auslesen/
function getUrlParam(name) {
    var url_string = window.location;
    var url = new URL(url_string);
    var c = url.searchParams.get(name);
    return c;
}