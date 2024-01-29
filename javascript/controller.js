/** Die Klasse Controller bildet die Verbindung zwischen dem HTML-Dokument und
   der Programmierlogik
   Ich führe den Controller als Singleton aus - zwei Controller machen keinen Sinn ;-)
    - nach der Webseite https://www.heise.de/blog/GoF-Entwurfsmuster-in-JavaScript-Teil-1-Singleton-3079815.html
*/



class Controller {
    constructor(name) {
        if (typeof Controller.instance === 'object') {
            return Controller.instance;
        } else {
            //erster und einziger Aufruf der Initialisierung
            this.name = name;
            Controller.instance = this;
            //TODO: Logik initialisieren
            this.wahlbogen = new Wahlbogen();
        }
    }

    /**
     * getInstanceMethode um den Controller zur erhalten
     * @returns die einzige instanz des Controllers
     */
    static getInstance() {
        Controller.instance = new Controller("Controller - Instanz");
        Controller.getInstance = function () {
            return Controller.instance;
        }
        return Controller.instance;
    }

    /** init initialisiert:
        * Den Abijahrgang

        * Die Tabelle...
        TODO füllen
    */
    init() {
        let self = this;
        console.log("Das Dokument wurde geladen. init() wird aufgerufen.");

        this.drawAbijahrgang();

        //alle Buttons mit click-Eventlistener versehen
        let buttons = document.getElementsByTagName('button'); //HTML-collection
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", (obj) => this.objectClicked(obj));
        }

        //TODO : nur zu Testzwecken - evtl. später entfernen
        this.wahlbogen.erzeugeMinimaleFachbelegung();

        //TODO : Wann sollen die Belegungsverpflichtungen immer neu dargestellt und geprüft werden?!
        this.drawBelegungsverpflichtungen();


        this.drawTable();
        // Test Wahlarten
        console.log("Test", this.wahlbogen.fachbelegungen[0].belegungsBed.gibNaechsteBelegungsmöglichkeit(2, 'S'));
    }

    /**
     * zeichnet das Feld Belegungsverpflichtungen neu 
     * nachdem eine neue Überprüfung gestartet wurde
     */
    drawBelegungsverpflichtungen() {
        let bericht = PruefeBelegungsBedingungen.pruefeAlle(this.wahlbogen);
        document.getElementById('Belegverpflichtungen').innerHTML = bericht;
    }

    /**
     * Reagiert auf Clicks auf Elemente - bekommt das event als Parameter
     * wird angelegt mit element.addEventListener("click", (obj) => this.cellClicked(obj));
     * @param {*} event - das event, das ausgelöst wird
     */
    objectClicked(event) {
        let self = this;
        // Verhindert das Standardverhalten eines Links oder so (falls vorhanden)
        event.preventDefault();

        // Ermittelt die ID und TAG-Name des angeklickten Elements
        //console.log(event.target);
        let clickedObjectID = event.target.id;
        let clickedObjectTAG = event.target.tagName;


        // Je nach Item muss eine passende Reaktion progrmmiert werden
        console.log("Objekt typ " + clickedObjectTAG + " geklickt: " + clickedObjectID);
        //TODO: Reaktion auf Clicks
        if (clickedObjectTAG === 'BUTTON') {
            switch (clickedObjectID) {
                case 'TestButton':
                    console.log("Testbutton geklickt - heute Download :-)");
                    downloadJSON(this.wahlbogen);
                    break;
                case 'LadeDatei':
                    console.log("Lade Datei geklickt");
                    openJSON();
                    break;
                default:
                    console.log("Button ID unbekannt");
            }
        }
    }

    /**
     * ein vollständiges Neu darstellen des Wahlbogens!
     */
    redraw() {
        //Kopfzeilen
        document.getElementById('kopfzeile').innerHTML = "Oberstufenwahl Abijahrgang " + this.wahlbogen.abiJahrgang;
        // TODO Vorname, Nachname, usw.
        this.drawTable(); //Wahlen
        // TODO Infos
        // TODO Summen...
    }

    /**
     * Stellt den Abijahrgang aus dem Wahlbogen auf der Webseite dar (z.B. 2027)
     */
    drawAbijahrgang() {
        document.getElementById('kopfzeile').innerHTML = "Oberstufenwahl Abijahrgang " + this.wahlbogen.abiJahrgang;
    }

    /**
     * Der Tabellenbereich mit den Wahlen wird nue dargestellt
     */
    drawTable() {
        //TODO 
        let table = document.getElementById('Fächerwahl');
        //table.innerHTML=""; //Tabelle löschen
        while (table.rows.length > 1) {
            table.deleteRow(1); // Kopfzeile 0 bleibt erhalten
        }
        this.wahlbogen.fachbelegungen.forEach((value) => {
            //Tabellenzeile anlegen
            this.tabellenZeileFuerFachAnhaengen(table, value);

        })
    }

    redrawZeile(kuerzel) {
        const zeile = document.getElementById(kuerzel);
        const fach = this.wahlbogen.getFachMitKuerzel(kuerzel);
        if (fach != null && zeile != null && zeile.tagName == "TR") {
            // Zeile existiert und fach Existiert
            zeile.innerHTML = ""; //löschen
            //Hintergrundfarbe setzen
            zeile.style.backgroundColor = fach.bgcolor;
            let zelle = zeile.insertCell(0);
            zelle.innerHTML = fach.bezeichnung;
            zelle = zeile.insertCell(1);
            zelle.innerHTML = fach.kuerzel;
            for (let i = 0; i < 6; i++) { //Halbjahre durchlaufen
                zelle = zeile.insertCell(-1) //erstes Halbjahr
                zelle.innerHTML = fach.belegung[i];
                zelle.id = "hj" + i;
                zelle.addEventListener("click", (obj) => this.cellClicked(obj));
            }
        }

    }

    tabellenZeileFuerFachAnhaengen(tabelle, fach) {
        let zeile = tabelle.insertRow(-1);
        zeile.id = fach.kuerzel;
        this.redrawZeile(fach.kuerzel);
    }

    //Methode die ausgeführt werden soll, wenn auf eine Zelle der Tabelle geklickt wird
    cellClicked(obj) {
        //obj is vom Type click?!
        //obj.target ist ein Element vom DOM - glaube ich
        if (obj.target.tagName == "TD" && obj.target.id.startsWith("hj")) { //Es wurde in Halbjahrszelle geklickt
            const gewKrz = obj.target.parentNode.id;  //id des Parent Node <tr> ist das FachKürzel
            const gewHj = Number.parseInt(obj.target.id.slice(2));
            console.log("click - FachKrzl: ", gewKrz, " im Halbjahr: ", gewHj, "(start bei 0)");
            const fach = this.wahlbogen.getFachMitKuerzel(gewKrz);
            fach.setzeBelegungWeiter(gewHj);
            this.redrawZeile(gewKrz);
            //TODO - soll das wirklich immer passieren?
            this.drawBelegungsverpflichtungen();
        } else {
            console.log("Angeklicktes Objekt: ", obj.target)
        }
    }
}

let c = new Controller("Hauptcontroller");
//Funktion init soll nach dem Laden des HTML-Docs alles Initialisieren
//Mit Arrow-Notation (=>), damit in der Funktion auf das richtige this zugegriffen wird
document.addEventListener("DOMContentLoaded", (event) => c.init(event));


