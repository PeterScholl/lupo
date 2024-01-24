/* Die Klasse Controller bildet die Verbindung zwischen dem HTML-Dokument und
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
    //getInstanceMethode um den Controller zur erhalten
    static getInstance() {
        Controller.instance = new Controller("Controller - Instanz");
        Controller.getInstance = function () {
            return Controller.instance;
        }
        return Controller.instance;
    }

    /* init initialisiert:
        * Den Abijahrgang

        * Die Tabelle...
        TODO füllen
    */
    init() {
        let self = this;
        console.log("Das Dokument wurde geladen. init() wird aufgerufen.");

        document.getElementById('kopfzeile').innerHTML = "Oberstufenwahl Abijahrgang "+this.wahlbogen.abiJahrgang;

        //TODO : nur zu Testzwecken - evtl. später entfernen
        this.wahlbogen.erzeugeMinimaleFachbelegung();




        this.drawTable();
    }

    // Funktion, die aufgerufen wird, wenn etwas angeclickt wird
    objectClicked(event) {
        let self = this;
        // Verhindert das Standardverhalten eines Links oder so (falls vorhanden)
        event.preventDefault();

        // Ermittelt die ID des angeklickten Elements
        var clickedObjectID = event.target.id;

        // Je nach Menuitem muss eine passende Reaktion progrmmiert werden
        console.log("Objekt geklickt: " + clickedObjectID);
        //TODO: Reaktion auf Menu-Items
    }

    //Funktion die den Tabellenbereich (TODO neu?) zeichnet
    drawTable() {
        //TODO 
        let table = document.getElementById('Fächerwahl');
        //table.innerHTML=""; //Tabelle löschen
        while (table.rows.length > 1) {
            table.deleteRow(1); // Kopfzeile 0 bleibt erhalten
        }
        this.wahlbogen.fachbelegungen.forEach((value)=> {
            //Tabellenzeile anlegen
            this.tabellenZeileFuerFachAnhaengen(table,value);
            
        })
    }

    tabellenZeileFuerFachAnhaengen(tabelle,fach) {
        let zeile = tabelle.insertRow(-1);
        zeile.id=fach.kuerzel;
        //Hintergrundfarbe setzen
        zeile.style.backgroundColor=fach.bgcolor;
        let zelle = zeile.insertCell(0);
        zelle.innerHTML = fach.bezeichnung + " (" + fach.kuerzel + ")";
        for (let i=0; i<6; i++) { //Halbjahre durchlaufen
            zelle = zeile.insertCell(-1) //erstes Halbjahr
            zelle.innerHTML = fach.belegung[i];
            zelle.id="hj"+i;
            zelle.addEventListener("click",(obj)=>this.cellClicked(obj));
        }
    }

    //Methode die ausgeführt werden soll, wenn auf eine Zelle der Tabelle geklickt wird
    cellClicked(obj) {
        console.log("click",obj);
    }
}

let c = new Controller("Hauptcontroller");
//Funktion init soll nach dem Laden des HTML-Docs alles Initialisieren
//Mit Arrow-Notation (=>), damit in der Funktion auf das richtige this zugegriffen wird
document.addEventListener("DOMContentLoaded", (event) => c.init(event));


