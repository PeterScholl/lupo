/** In dieser Klasse wird ein Fach und die Fachwahl/Belegung verwaltet
diese Belegung kann auch leer sein...
*/
class Fachbelegung {
    bezeichnung = "Deutsch";
    kuerzel = "D"
    belegung = ['', '', '', '', '', '']; //nicht belegt
    belegungsBed = new BelegBed(); // Stundenzahl, M,S,LK,ZK möglich
    faecherGruppe = "FG1";
    abifach = 0; // ist dieses Fach ein gewähltes Abifach 1-4 sonst 0
    istFFS = false; // ist fortgeführte Fremdsprache

    constructor(bezeichnung, kuerzel) {
        this.bezeichnung = bezeichnung;
        this.kuerzel = kuerzel;
    }

    /**
     * Setzt die Belegung für das angebene Halbjahr auf den nächsten gültigen Wert
     * und ab Q1 auch die Folgehalbjahre auf den gleichen Wert
     * 
     * @param {*} halbjahr 0-5 in dem die Belegung hochgesetzt werden soll
     */
    setzeBelegungWeiter(halbjahr) {
        let bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr, this.belegung[halbjahr]);
        if (bel_neu === "ZK" && !(this.belegung[halbjahr-1]=='' || this.belegung[halbjahr-1] == 'ZK') ) { //prüfen ob ZK hier zulässig ist sonst noch einen weiter setzen
            bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr, bel_neu); //noch eine Belegung weiter
        }
        if (bel_neu === "LK" && !this.istLKWahlZulaessig(halbjahr)) { //prüfen ob LK hier zulässig ist sonst noch einen weiter setzen
            bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr, bel_neu); //noch eine Belegung weiter
        }
        if (halbjahr > 1 && bel_neu != "LK" && this.istLK()) { // ein Halbjahr nach Q1.1 wurde vom LK weg gewählt
            //alle Haljahre der Q-Phase abwählen
            halbjahr=2;
            bel_neu='';
            console.log("Abifach von ",this.kuerzel,"auf 0 zurückgesetzt");
            this.abifach=0; //Abifach zurücksetzen
        }
        this.belegung[halbjahr] = bel_neu;
        // Bei Q1 auch die Folgebelegungen entsprechend setzen
        if (halbjahr > 1) { //in der Q1
            let folgeHalbjahr = halbjahr + 1;
            while (folgeHalbjahr < 6 && this.belegungsBed.istGueltig(folgeHalbjahr, bel_neu)) { //gültig
                this.belegung[folgeHalbjahr] = bel_neu;
                folgeHalbjahr++;
            }
        }
        if (this.istLK()) { // Dieses Fach ist jetzt LK
            Controller.getInstance().wahlbogen.setzeLKAbifachNr();
        }
    }

    /**
     * prüft ob das Fach als LK belegt wurde
     * @returns true wenn das Fach in einem Halbjahr als LK belegt wurde
     */
    istLK() {
        return this.belegung.some((e) => { return e === 'LK'; });
    }

    /**
     * prüft ob eine Wahl als LK in diesem Halbjahr zulässig ist
     * @param {int} halbjahr 0-5 
     * @returns true wenn zulässig
     */
    istLKWahlZulaessig(halbjahr) {
        let valid = true;
        const wb = Controller.getInstance().wahlbogen;
        valid &= this.istLK() || wb.gibLKFaecher().length < 2; // es gibt schon zwei andere LKs
        //valid &= (halbjahr == 2) || (halbjahr > 2 && this.belegung[halbjahr - 1] == 'LK'); // Änderung auf LK nur in Q1.1
        valid &= (halbjahr == 2); // Änderung auf LK nur in Q1.1
        valid &= this.belegung[1] != ''; //wurde in der EF belegt
        return valid;
    }

    /**
     * prüft ob dieses Fach als drittes oder viertes Abifach gewählt werden kann
     * und ob es in der Q2.2 belegt war
     * @returns true, wenn dieses Fach als Abifach gewählt werden kann
     */
    alsAbifachMgl() {
        return (this.belegungsBed.alsAbifach && this.belegung[5]!='' && this.belegung[5]!='ZK');  
    }

    /**
     * gibt die zu wertende Stundenzahl im angebgebenen Halbjahr (0-5)
     * @param {*} halbjahr 0-5
     * @returns Stundenzahl für dieses Halbjahr
     */
    gibStundenzahlImHalbjahr(halbjahr) {
        if (halbjahr >= 0 && halbjahr < 6 && this.belegung[halbjahr] != '') {
            if (this.belegung[halbjahr] == 'LK') {
                return 5;
            } else {
                return this.belegungsBed.stundenzahlen[halbjahr];
            }
        }
        return 0;
    }

    /**
     * Schreibt für das Fach die Belegung vom übergebenen Halbjahr an hoch
     * sofern Möglich
     * @param {Integer} halbjahr (0-5)
     */
    hochschreibenVon(halbjahr) {
        //console.log("Hochschreiben Fach",this.bezeichnung);
        for (let i=halbjahr+1; i<6; i++) {
            if (this.belegungsBed.wahlarten[i].includes(this.belegung[i-1])) {
                this.belegung[i]=this.belegung[i-1];
            } else {
                this.belegung[i]='';
            }
        }
    }

    /**
     * Methode um eine Fachbelegung von einem JSONObj zu generieren
     * @param {} jsonObj 
     * @return neue Fachbelegung
     */
    static generateFromJSONObj(jsonObj) {
        let neueBlg = null;
        // Bezeichnung und Kürzel übernehmen
        if (typeof (jsonObj.bezeichnung) === 'string' && typeof (jsonObj.kuerzel) === 'string') {
            neueBlg = new Fachbelegung(jsonObj.bezeichnung, jsonObj.kuerzel);
            console.log("Fach ", jsonObj.bezeichnung, " Krzl: ", jsonObj.kuerzel);
        } else {
            neueBlg = new Fachbelegung("Ungueltig", "--");
        }

        //Belegung übernehmen
        if (typeof (jsonObj.belegung) === 'object' && Array.isArray(jsonObj.belegung) && jsonObj.belegung.length == 6) {
            neueBlg.belegung = jsonObj.belegung;
        } else {
            console.log("Belegung in JSON-File Fehlerhaft");
        }

        //Belegungsbedingungen übernehmen
        if (typeof (jsonObj.belegungsBed) === 'object') {
            neueBlg.belegungsBed = BelegBed.generateFromJSONObj(jsonObj.belegungsBed);
        }

        //Fächergruppe übernehmen
        if (typeof (jsonObj.faecherGruppe) === 'string') {
            neueBlg.faecherGruppe = jsonObj.faecherGruppe;
        }

        //Abifach
        neueBlg.abifach = jsonObj.abifach;

        //fortgeführte Fremdsprache
        if (typeof(jsonObj.istFFS) === 'boolean') {
            neueBlg.istFFS = jsonObj.istFFS;
        }

        return neueBlg;
    }
}