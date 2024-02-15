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
            /**
             * der "einzige" Wahlbogen
             * @type Wahlbogen
             */
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

        //alle Menuitems mit click-Eventlistener versehen
        let anchors = document.querySelectorAll('.dropdown-content a');
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].addEventListener("click", (obj) => this.objectClicked(obj));
        }

        //Prüfen ob eine Datei mit einem get-Parmeter übergeben wurde
        //Wurde ein Dokument per get-Parameter übergeben?
        //sonst Minimalbelegung erzeugen
        let dest = getUrlParam("url");
        if (dest) {
            console.log("JSON laden von " + dest);
            openJSONFromURL(dest); //Wird dann automatisch gezeichnet
        } else {
            this.wahlbogen.erzeugeMinimaleFachbelegung();
            this.redraw(); //Alles zeichnen
        }
    }

    /**
     * zeichnet das Feld Belegungsverpflichtungen neu 
     * nachdem eine neue Überprüfung gestartet wurde
     */
    drawBelegungsverpflichtungen() {
        let bericht = PruefeBelegungsBedingungen.pruefeAlle(this.wahlbogen);
        let newdiv = document.getElementById('Belegverpflichtungen');
        //newdiv.style.overflowY="scroll";
        newdiv.classList.add('div-pruef');
        newdiv.innerHTML = bericht;
    }

    /**
     * aktualisiert die Tabelle mit den Kurssummen und Stundenzahlen
     */
    drawStundenzahlen() {
        for (let h = 0; h < 6; h++) { //Halbjahre durchlaufen
            document.getElementById('x' + (h + 1)).innerHTML = this.wahlbogen.getKurseFuershalbjahr(h);
            document.getElementById('y' + (h + 1)).innerHTML = this.wahlbogen.getStundenFuershalbjahr(h);
        }
        document.getElementById('z1').innerHTML = this.wahlbogen.getStundenDurchschnittFuerEPhase();
        document.getElementById('z2').innerHTML = this.wahlbogen.getStundenDurchschnittFuerQPhase();
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
        //Reaktion auf Clicks
        if (clickedObjectTAG === 'BUTTON' || clickedObjectTAG === 'A') {
            switch (clickedObjectID) {
                case 'Speichern':
                    console.log("Speichern geklickt");
                    downloadJSON(this.wahlbogen);
                    break;
                case 'TestButton':
                    console.log("Testbutton geklickt - heute Stundenzahlen :-)");
                    this.drawStundenzahlen();
                    break;
                case 'LadeDatei':
                    console.log("Lade Datei geklickt");
                    openJSON();
                    break;
                case 'HochschreibenEF1':
                    console.log("Hochschreiben von der EF1");
                    this.wahlbogen.hochschreibenVon(0);
                    this.drawTable();
                    this.drawBelegungsverpflichtungen(); //inklusive Prüfung
                    break;
                case 'HochschreibenEF2':
                    console.log("Hochschreiben von der EF.2");
                    this.wahlbogen.hochschreibenVon(1);
                    this.drawTable();
                    this.drawBelegungsverpflichtungen(); //inklusive Prüfung
                    break;
                default:
                    console.log("Button ID unbekannt");
            }
        } else if (clickedObjectTAG === 'INPUT' && event.target.type === 'checkbox') {
            //console.log(clickedObjectID+" wird auf "+ event.target.checked + " gesetzt");
            const fach = this.wahlbogen.getFachMitKuerzel(clickedObjectID);
            fach.istFFSSekI = event.target.checked;
            if (!event.target.checked) {
                fach.abwaehlen();
            }
            this.redrawZeile(clickedObjectID);
            this.drawStundenzahlen();
        }
    }

    /**
     * Methode um beim anklicken eines Objekts eine Klasse zu aktivieren oder zu deaktivieren
     * @param {} target - das angeklickte Objekt 
     * @param {*} className - die zu toggelnde Klasse
     */
    objectClickedToggleClass(target, className) {
        console.dir(target);
        target.classList.toggle(className);
    }

    /**
     * ein vollständiges Neu darstellen des Wahlbogens!
     */
    redraw() {
        let self = this;
        //Kopfzeilen
        document.getElementById('kopfzeile').innerHTML = "Oberstufenwahl Abijahrgang " + this.wahlbogen.abiJahrgang;
        // TODO Vorname, Nachname, usw.
        //fortgeführte Fremdsprachen
        let ffs = document.querySelector("FORM#ffs");
        ffs.innerHTML = "";
        ffs.appendChild(document.createTextNode("Fremdsprachen SekI: "));
        this.wahlbogen.gibFortgefuehrteFS().forEach(
            function (e) {
                let input = document.createElement("input");
                input.setAttribute('type', 'checkbox');
                input.setAttribute('id', e.kuerzel);
                input.setAttribute('name', e.kuerzel);
                input.setAttribute('value', e.kuerzel);
                input.checked = e.istFFSSekI;
                input.addEventListener('change', (e) => { self.objectClicked(e); });
                ffs.appendChild(input);
                let label = document.createElement("label");
                label.setAttribute('for', e.kuerzel);
                label.innerHTML = e.kuerzel;
                ffs.appendChild(label);
            }
        );

        this.drawTable(); //Wahlen
        // TODO Summen...
        this.drawBelegungsverpflichtungen(); //Belegungsverpflichtungen
        // TODO Infos
    }

    /**
     * Stellt den Abijahrgang aus dem Wahlbogen auf der Webseite dar (z.B. 2027)
     */
    drawAbijahrgang() {
        document.getElementById('kopfzeile').innerHTML = "Oberstufenwahl Abijahrgang " + this.wahlbogen.abiJahrgang;
    }

    /**
     * Der Tabellenbereich mit den Wahlen wird neu dargestellt
     */
    drawTable() {
        let table = document.getElementById('Faecherwahl');
        //table.innerHTML=""; //Tabelle löschen
        while (table.rows.length > 1) {
            table.deleteRow(1); // Kopfzeile 0 bleibt erhalten
        }
        this.wahlbogen.fachbelegungen.forEach((value) => {
            //Tabellenzeile anlegen
            this.tabellenZeileFuerFachAnhaengen(table, value);
        })
        // Zeilen für Stundensummen anhängen
        this.tabellenZeilenFuerSummenAnhaengen(table);
        this.drawStundenzahlen();
    }

    redrawZeile(kuerzel) {
        const zeile = document.querySelector("TR#" + kuerzel);
        zeile.classList.add('Fach');
        const fach = this.wahlbogen.getFachMitKuerzel(kuerzel);
        if (fach != null && zeile != null && zeile.tagName == "TR") {
            // Zeile existiert und fach Existiert
            zeile.innerHTML = ""; //löschen
            //Hintergrundfarbe setzen
            //zeile.style.backgroundColor = fach.bgcolor;
            zeile.classList.add(fach.faecherGruppe);
            let zelle = zeile.insertCell(0);
            zelle.innerHTML = fach.bezeichnung;
            zelle = zeile.insertCell(1);
            zelle.innerHTML = fach.kuerzel;
            for (let i = 0; i < 6; i++) { //Halbjahre durchlaufen
                zelle = zeile.insertCell(-1); //erstes Halbjahr
                if (!(fach.istWaehlbar(i) || fach.istAlsZKWaehlbar(i))) {
                    zelle.classList.add("disabled");
                } else {
                    zelle.addEventListener("click", (obj) => this.cellClicked(obj));
                }
                zelle.innerHTML = fach.belegung[i];
                zelle.id = "hj" + i;
            }
            // Zelle für das Abifach
            zelle = zeile.insertCell(-1); // Zelle für das Abifach
            if (!fach.alsAbifachMgl() && fach.belegung[5] != 'LK') {
                //disabled wenn das FAch nicht Abifach werden kann
                zelle.classList.add("disabled");
            } else {
                zelle.innerHTML = fach.abifach > 0 ? fach.abifach : '';
                zelle.id = "abifach";
                zelle.addEventListener("click", (obj) => this.cellClicked(obj));
            }
        }

    }

    tabellenZeileFuerFachAnhaengen(tabelle, fach) {
        let zeile = tabelle.insertRow(-1);
        zeile.id = fach.kuerzel;
        this.redrawZeile(fach.kuerzel);
    }

    tabellenZeilenFuerSummenAnhaengen(table) {
        // Zeile für die Kurssummen (linke Beschreibungsspalte)
        let zeile_kurssummen = table.insertRow(-1);
        zeile_kurssummen.style.borderTop = "thick double";
        let infocell = zeile_kurssummen.insertCell(-1);
        infocell.classList.add("cell_summ_desc");
        infocell.setAttribute("colspan", 2);
        infocell.innerHTML = "Kurse:";
        // Zeile für die Stundensummen (linke Beschreibungsspalte)
        let zeile_stundensummen = table.insertRow(-1);
        infocell = zeile_stundensummen.insertCell(-1);
        infocell.classList.add("cell_summ_desc");
        infocell.setAttribute("colspan", 2);
        infocell.innerHTML = "Wochenstunden:";
        // Zellen für die Kurssummen und Stundensummen
        for (let h = 0; h < 6; h++) {
            let newcell = zeile_kurssummen.insertCell(-1);
            newcell.id = "x" + (h + 1);
            newcell.classList.add("cell_summ_content");
            newcell = zeile_stundensummen.insertCell(-1);
            newcell.id = "y" + (h + 1);
            newcell.classList.add("cell_summ_content");
        }
        // Zeile für den Durchschnitt in EF und Q1
        let zeile_durchschnitt = table.insertRow(-1);
        infocell = zeile_durchschnitt.insertCell(-1);
        infocell.classList.add("cell_summ_desc");
        infocell.setAttribute("colspan", 2);
        infocell.innerHTML = "Durchschnitt:";
        infocell = zeile_durchschnitt.insertCell(-1);
        infocell.setAttribute("colspan", 2);
        infocell.id = "z1";
        infocell = zeile_durchschnitt.insertCell(-1);
        infocell.setAttribute("colspan", 4);
        infocell.id = "z2";
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
            // alle Fächer die dieses Fach als Vorgänger haben auch neu Zeichnen
            this.wahlbogen.gibFaecherMitVorgaenger(gewKrz).forEach((fach) => {
                console.log("Neu zeichnen", fach.kuerzel);
                this.redrawZeile(fach.kuerzel);
            });
            this.drawBelegungsverpflichtungen();
            this.drawStundenzahlen();
        } else if (obj.target.tagName === "TD" && obj.target.id === "abifach") {
            //Es wurde in die Abifachzelle geklickt
            const gewKrz = obj.target.parentNode.id; // id des Parent Node <tr> ist das FachKürzel
            //console.log("Angeklicktes Abifach: ", gewKrz);
            this.wahlbogen.aendereAbifach(gewKrz);
            this.redraw(gewKrz);
            //ggf. Abi3 und Abifach 4 neu zeichnen
            [3, 4].forEach(el => {
                let abif = this.wahlbogen.gibAbifach(el);
                if (abif != null && abif.kuerzel != gewKrz) {
                    this.redraw(abif.kuerzel);
                }
            });
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


