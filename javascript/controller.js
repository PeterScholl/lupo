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
        debug_info("Das Dokument wurde geladen. init() wird aufgerufen.");

        // Info-Modal einrichten
        const infoModalCheckbox = document.getElementById("modalGelesen");
        debug_info("Cookie?: ",getCookie("lupo-info-read"));
        if (getCookie("lupo-info-read") === "true") {
            this.modalGesehen = true;
            infoModalCheckbox.checked = true;
        } else {
            this.modalGesehen = false; // soll gezeichnet werden
            infoModalCheckbox.checked = false;
        }
        const modal = document.getElementById("infoModal"); //Das Modal - der Hintergrund!
        document.querySelector("span.close").onclick = function () {
            //dies ist nur der Close-Button (X oben rechts)
            modal.style.display = "none";
        }
        modal.onclick = function () { // Wenn man auf den Hintergrund klickt - ausblenden
            modal.style.display = "none";
        }
        infoModalCheckbox.onchange = function (event) { //Änderung der Gesehen-Checkbox
            if (event.target.checked) {
                debug_info("Cookie setzen!");
                setCookie("lupo-info-read", "true", 365);
            } else {
                //cookie löschen
                debug_info("Cookie löschen!");
                setCookie("lupo-info-read", "true", 0);
            }
        }

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
            debug_info("JSON laden von " + dest);
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
        bericht = PruefeBelegungsBedingungen.pruefeAlleKlausurBed(this.wahlbogen);
        newdiv = document.getElementById('Klausurverpflichtungen');
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
        //Färbung dieser Zellen
        //EF
        for (let h = 0; h < 2; h++) { // Halbjahre der EF
            const cellx = document.getElementById('x' + (h + 1));
            const celly = document.getElementById('y' + (h + 1));
            const x_value = Number.parseInt(cellx.innerHTML);
            const y_value = Number.parseInt(celly.innerHTML);
            if (x_value <= 9) {
                cellx.style.backgroundColor = "red";
            } else if (x_value <= 10) {
                cellx.style.backgroundColor = "yellow";
            } else {
                cellx.style.backgroundColor = "lightgreen";
            }
            if (y_value <= 31) {
                celly.style.backgroundColor = "red";
            } else if (y_value <= 32) {
                celly.style.backgroundColor = "yellow";
            } else if (y_value <= 36) {
                celly.style.backgroundColor = "lightgreen";
            } else {
                celly.style.backgroundColor = "green";
            }
        }
        //Summe EF
        let cellz = document.getElementById('z1');
        let z_value = Number.parseFloat(cellz.innerHTML);
        if (z_value <= 33.5) {
            cellz.style.backgroundColor = "red";
        } else {
            cellz.style.backgroundColor = "lightgreen";
        }
        //Q1
        for (let h = 2; h < 6; h++) { // Halbjahre der Q1
            const cellx = document.getElementById('x' + (h + 1));
            const celly = document.getElementById('y' + (h + 1));
            const x_value = Number.parseInt(cellx.innerHTML);
            const y_value = Number.parseInt(celly.innerHTML);
            if (x_value <= 8) {
                cellx.style.backgroundColor = "red";
            } else if (x_value <= 9) {
                cellx.style.backgroundColor = "yellow";
            } else {
                cellx.style.backgroundColor = "lightgreen";
            }
            if (y_value <= 30) {
                celly.style.backgroundColor = "red";
            } else if (y_value <= 32) {
                celly.style.backgroundColor = "yellow";
            } else if (y_value <= 36) {
                celly.style.backgroundColor = "lightgreen";
            } else {
                celly.style.backgroundColor = "green";
            }
        }
        //Summe Q1
        cellz = document.getElementById('z2');
        z_value = Number.parseFloat(cellz.innerHTML);
        if (z_value <= 33.75) {
            cellz.style.backgroundColor = "red";
        } else {
            cellz.style.backgroundColor = "lightgreen";
        }
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
        let clickedObjectID = event.target.id;
        let clickedObjectTAG = event.target.tagName;


        // Je nach Item muss eine passende Reaktion progrmmiert werden

        debug_info("Objekt typ " + clickedObjectTAG + " geklickt: " + clickedObjectID);
        //Reaktion auf Clicks
        if (clickedObjectTAG === 'BUTTON' || clickedObjectTAG === 'A') {
            switch (clickedObjectID) {
                case 'Speichern':
                    debug_info("Speichern geklickt");
                    downloadJSON(this.wahlbogen);
                    break;
                case 'TestButton':
                    debug_info("Testbutton geklickt - heute Stundenzahlen :-)");
                    this.drawStundenzahlen();
                    break;
                case 'LadeDatei':
                    debug_info("Lade Datei geklickt");
                    openJSON();
                    break;
                case 'HochschreibenEF1':
                    debug_info("Hochschreiben von der EF1");
                    this.wahlbogen.hochschreibenVon(0);
                    this.drawTable();
                    this.drawBelegungsverpflichtungen(); //inklusive Prüfung
                    break;
                case 'HochschreibenEF2':
                    debug_info("Hochschreiben von der EF.2");
                    this.wahlbogen.hochschreibenVon(1);
                    this.drawTable();
                    this.drawBelegungsverpflichtungen(); //inklusive Prüfung
                    break;
                case 'InfosAbout':
                    debug_info("Infos / About geklickt");
                    this.showModal();
                    break;
                default:
                    debug_info("Button ID unbekannt");
            }
        } else if (clickedObjectTAG === 'INPUT' && event.target.type === 'checkbox') {
            //debug_info(clickedObjectID+" wird auf "+ event.target.checked + " gesetzt");
            const fach = this.wahlbogen.getFachMitKuerzel(clickedObjectID);
            fach.istFFSSekI = event.target.checked;
            if (!event.target.checked) {
                fach.abwaehlen();
            }
            this.redrawZeile(clickedObjectID);
            this.drawBelegungsverpflichtungen();
            this.drawStundenzahlen();
        }
    }

    /**
     * übernimmt geänderte Basisdaten der Webseite in den Wahlbogen und Printbereich
     */
    basisdatenUebernehmen() {
        debug_info("Update Basisdaten - Controller.basisdatenUebernehmen");
        this.wahlbogen.name = document.getElementById('nachname').value;
        this.wahlbogen.vorname = document.getElementById('vorname').value;
        this.nameInPrintBereichSchreiben(this.wahlbogen.vorname, this.wahlbogen.name);
    }

    /**
     * Schreibt den Vornamen und Nachnamen in den Bereich, der nur bei der Printausgabe angezeigt wird
     * @param {String} vorname 
     * @param {String} nachname 
     */
    nameInPrintBereichSchreiben(vorname, nachname) {
        document.getElementById('VorNachName').innerHTML = "Name: " + nachname + ", " + vorname;
    }

    /**
     * Methode um beim anklicken eines Objekts eine Klasse zu aktivieren oder zu deaktivieren
     * @param {} target - das angeklickte Objekt 
     * @param {*} className - die zu toggelnde Klasse
     */
    objectClickedToggleClass(target, className) {
        debug_info(target);
        target.classList.toggle(className);
    }

    /**
     * ein vollständiges Neu darstellen des Wahlbogens!
     */
    redraw() {
        let self = this;

        // Info - modal
        if (!this.modalGesehen) {
            this.showModal();
        }
        //Logo
        if (typeof (this.wahlbogen.logo_url) === 'string' && this.wahlbogen.logo_url != "") {
            debug_info("input", this.wahlbogen.logo_url);
            document.getElementsByTagName("img")[0].setAttribute("src", this.wahlbogen.logo_url);
        }
        //Kopfzeilen
        document.getElementById('kopfzeile').innerHTML = "Oberstufenwahl Abijahrgang " + this.wahlbogen.abiJahrgang;
        // Vorname, Nachname, usw.
        debug_info("Vorname,Nachname im Wahlbogen:", this.wahlbogen.vorname, this.wahlbogen.name);
        if (this.wahlbogen.vorname != '') {
            document.getElementById('vorname').value = this.wahlbogen.vorname;
        }
        if (this.wahlbogen.name != '') {
            document.getElementById('nachname').value = this.wahlbogen.name;
        }
        this.nameInPrintBereichSchreiben(this.wahlbogen.vorname, this.wahlbogen.name);

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

    /**
     * aktualisiert die Tabellenzeile mit dem angegebenen Kürzel
     * @param {String} kuerzel 
     */
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

    /** setzt die display-Variable des Infomodals auf block */
    showModal() {
        const modal = document.getElementById("infoModal");
        modal.style.display = "block";
        this.modalGesehen = true;
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
            debug_info("click - FachKrzl: ", gewKrz, " im Halbjahr: ", gewHj, "(start bei 0)");
            const fach = this.wahlbogen.getFachMitKuerzel(gewKrz);
            fach.setzeBelegungWeiter(gewHj);
            this.redrawZeile(gewKrz);
            // alle Fächer die dieses Fach als Vorgänger haben auch neu Zeichnen
            this.wahlbogen.gibFaecherMitVorgaenger(gewKrz).forEach((fach) => {
                debug_info("Neu zeichnen", fach.kuerzel);
                this.redrawZeile(fach.kuerzel);
            });
            this.drawBelegungsverpflichtungen();
            this.drawStundenzahlen();
        } else if (obj.target.tagName === "TD" && obj.target.id === "abifach") {
            //Es wurde in die Abifachzelle geklickt
            const gewKrz = obj.target.parentNode.id; // id des Parent Node <tr> ist das FachKürzel
            //console.log("Angeklicktes Abifach: ", gewKrz);
            //alte Abifaecher fuer neu zeichnen speichern
            let aktAbifaecher = this.wahlbogen.fachbelegungen.filter((f) => {return f.abifach > 2;});
            this.wahlbogen.aendereAbifach(gewKrz);
            this.redrawZeile(gewKrz);
            //ggf. alte Abifächer neu zeichnen
            aktAbifaecher.forEach((f) => {return this.redrawZeile(f.kuerzel);});
            this.drawBelegungsverpflichtungen();
        } else {
            debug_info("Angeklicktes Objekt: ", obj.target)
        }
    }







}

var debug = false;
let c = new Controller("Hauptcontroller");
//Funktion init soll nach dem Laden des HTML-Docs alles Initialisieren
//Mit Arrow-Notation (=>), damit in der Funktion auf das richtige this zugegriffen wird
document.addEventListener("DOMContentLoaded", (event) => c.init(event));


