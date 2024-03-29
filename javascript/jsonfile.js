/* Diese Datei bietet Hilfsfunktionen an um mit JSON-Files
   zu arbeiten */

/**
 * Laedt einen Wahlbogen als json-Datei herunter
 * @param {*} wahlbogen der zum Download zu bereitende Wahlbogen
 */
function downloadJSON(wahlbogen) {
    if (!wahlbogen instanceof Wahlbogen) {
        alert("Es wird kein Wahlbogen gespeichert");
        return;
    } else {
        debug_info("JSONFILE.js: downloadJSON - prüfung auf richtige Klasse erfolgreich");
    }


    // JSON-Text aus dem Objekt erstellen
    let jsonText = JSON.stringify(wahlbogen, null, 2);

    // Blob aus dem JSON-Text erstellen
    let blob = new Blob([jsonText], { type: 'application/json' });

    // Link erstellen
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    if (typeof(wahlbogen.name) === 'string' && wahlbogen.name != "") {

        a.download = 'wb_'+(wahlbogen.name.substring(0,20)+"_"+wahlbogen.vorname).substring(0,20)+'.json';
    } else {
        a.download = 'wahlbogen.json';
    }
    
    // Klicken Sie auf den Link, um das Herunterladen zu initiieren
    // NOTE: Alternativ Modal anzeigen und den Benutzer auf den Link klicken lassen mit
    //       dem Vorteil, dass man den Dateinamen auswählen/ändern kann
    a.click();

    // URL-Objekt freigeben, um Speicher freizugeben
    URL.revokeObjectURL(url);
}

/**
 * Funktion um einen Wahlbogen zu laden / importieren
 */
function openJSON() {
    // Ein unsichtbares Eingabefeld erstellen
    let dateiEingabe = document.createElement('input');
    dateiEingabe.type = 'file';
    dateiEingabe.accept = '.json'; // Nur JSON-Dateien zulassen

    // Eventlistener für das Ändern des Eingabefelds hinzufügen
    dateiEingabe.addEventListener('change', function () {
        // Überprüfen, ob eine Datei ausgewählt wurde
        if (dateiEingabe.files.length > 0) {
            // Die ausgewählte Datei
            let datei = dateiEingabe.files[0];

            // FileReader verwenden, um den Inhalt der Datei zu lesen
            let reader = new FileReader();

            // FileReader-Eventlistener für das Laden der Datei
            reader.onload = function (event) {
                // Der Inhalt der Datei als Text
                let jsonText = event.target.result;

                // Hier kannst du mit dem JSON-Text arbeiten, z.B. ihn analysieren oder anzeigen
                try {
                    // Versuche, den JSON-Text zu analysieren
                    let jsonObj = JSON.parse(jsonText);

                    let wahlbogen = parseJSONObjToWahlbogen(jsonObj);

                    PruefeBelegungsBedingungen.setzeQ2_2SMEntsprAbifach(wahlbogen);
                    Controller.getInstance().wahlbogen = wahlbogen;
                    Controller.getInstance().redraw();

                    // Erfolgreiches Ergebnis an eine Callback-Funktion zurückgeben
                    //ergebnisCallback(jsonObj);
                } catch (error) {
                    // Fehler beim Analysieren des JSON-Texts
                    console.error('Fehler beim Analysieren der JSON-Datei:', error);

                    // Fehlerhaftes Ergebnis (null) an eine Callback-Funktion zurückgeben
                    // ergebnisCallback(null);
                }
            };

            // Die Datei als Text lesen
            reader.readAsText(datei);
        }
    });

    // Das Eingabefeld klicken, um den Auswahldialog zu öffnen
    dateiEingabe.click();
}

/**
 * Lädt ein JSON-Dokument, das per URL übergeben wurde
 * @param {*} dest URL des Dokuments 
 */
function openJSONFromURL(dest) {
    wahlbogenFromJSONURL(dest)
        .then(response => { Controller.getInstance().wahlbogen=response; Controller.getInstance().redraw(); })
        .catch(error => {
            // Hier wird der Fehler behandelt
            debug_info('Fehler bei der Fetch-Anfrage:' + error);
            // Füge hier weitere Fehlerbehandlung hinzu, falls erforderlich
            alert("Wahlbogen fehlerhaft - kann nicht gelesen werden");
            Controller.getInstance().wahlbogen.erzeugeMinimaleFachbelegung();
            Controller.getInstance().redraw();
        });

        //Hier Controller.getInstance().wahlbogen = response
}

async function wahlbogenFromJSONURL(dest) {
    const response = await fetch(dest, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht OK');
    }
    const response_1 = await response.json();
    return parseJSONObjToWahlbogen(response_1);
}

/**
 * Erzeugt aus einem hoffentlich stimmigen JSON-Objekt einen 
 * Wahlbogen
 * @param {*} jsonObj zu interpretierendes JSON-Objekt
 * @returns wahlbogen
 */
function parseJSONObjToWahlbogen(jsonObj) {
    // einen sauberen Wahlbogen erstellen
    let wahlbogen = new Wahlbogen();
    // 1. Namen aus der Datei übernehmen
    if (typeof(jsonObj.name) === 'string') {
        wahlbogen.name = jsonObj.name;
    }
    wahlbogen.vorname = jsonObj.vorname;
    wahlbogen.abiJahrgang = jsonObj.abiJahrgang;

    // Logo :-)
    if (typeof(jsonObj.logo_url) === 'string') {
        wahlbogen.logo_url = jsonObj.logo_url;
    }

    // 2. fachbelegung übernehmen
    let fachbelegungen = [];
    if (Array.isArray(jsonObj.fachbelegungen)) {
        fachbelegungen = jsonObj.fachbelegungen.map((e) => { return Fachbelegung.generateFromJSONObj(e) });
    }
    wahlbogen.fachbelegungen = fachbelegungen;

    if (Array.isArray(jsonObj.verboteneFachKombis)) {
        debug_info("Verbotene Fachkombis:", JSON.stringify(jsonObj.verboteneFachKombis));
        wahlbogen.verboteneFachKombis = jsonObj.verboteneFachKombis;
    }
    return wahlbogen;
}


