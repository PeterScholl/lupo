/** In dieser Klasse wird ein Fach und die Fachwahl/Belegung verwaltet
diese Belegung kann auch leer sein...
*/
class Fachbelegung {
    bezeichnung = "Deutsch";
    kuerzel = "D";
    statKuerzel = "D"; //Statistik-Kürzel
    belegung = ['', '', '', '', '', '']; //nicht belegt
    belegungsBed = new BelegBed(); // Stundenzahl, M,S,LK,ZK möglich
    faecherGruppe = "FG1";
    abifach = 0; // ist dieses Fach ein gewähltes Abifach 1-4 sonst 0
    istFFS = false; // ist fortgeführte Fremdsprache
    istFFSSekI = false; // wurde als FFS in der Sek I belegt
    istBili = false; //Bilinguales Sachfach

    constructor(bezeichnung, kuerzel) {
        this.bezeichnung = bezeichnung;
        this.kuerzel = kuerzel;
        this.statKuerzel = kuerzel;
    }

    /**
     * Setzt die Belegung für das angebene Halbjahr auf den nächsten gültigen Wert
     * und ab Q1 auch die Folgehalbjahre auf den gleichen Wert
     * 
     * @param {*} halbjahr 0-5 in dem die Belegung hochgesetzt werden soll
     */
    setzeBelegungWeiter(halbjahr) {
        let bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr, this.belegung[halbjahr]);
        let validFound = false;
        do {
            validFound = true;
            //Leer ist immer gültig
            if (bel_neu === '') {
                continue;
            }
            // Zusatzkurs darf nicht gewählt werden, wenn im HJ davor etwas anderes
            if (bel_neu === "ZK" && !(this.belegung[halbjahr - 1] == '' || this.belegung[halbjahr - 1] == 'ZK')) { //prüfen ob ZK hier zulässig ist sonst noch einen weiter setzen
                bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr, bel_neu); //noch eine Belegung weiter
                validFound = false;
                continue;
            }
            // LK nur wenn zulässig
            if (bel_neu === "LK" && !this.istLKWahlZulaessig(halbjahr)) { //prüfen ob LK hier zulässig ist sonst noch einen weiter setzen
                bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr, bel_neu); //noch eine Belegung weiter
                validFound = false;
                continue;
            }
            // M oder S ohne dass hier wählbar ist
            if (['M', 'S'].includes(bel_neu) && !this.istWaehlbar(halbjahr)) {
                bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr, bel_neu); //noch eine Belegung weiter
                validFound = false;
                continue;
            }
        } while (!validFound);
        if (halbjahr > 1 && bel_neu != "LK" && this.istLK()) { // ein Halbjahr nach Q1.1 wurde vom LK weg gewählt
            //alle Haljahre der Q-Phase abwählen
            halbjahr = 2;
            bel_neu = '';
            debug_info("Abifach von ", this.kuerzel, "auf 0 zurückgesetzt");
            this.abifach = 0; //Abifach zurücksetzen
        }
        this.belegung[halbjahr] = bel_neu;
        if (bel_neu === '') {
            //Bei Abwahl müssen auch die Folgefächer geprüft werden
            //Liste aller Fächer, die dieses Fach als Vorgänger haben
            //Belegung prüfen
            this.pruefeBelegung();
            while (Controller.getInstance().wahlbogen.gibFaecherMitVorgaenger(this.kuerzel).some((e) => e.pruefeBelegung())) {
                this.pruefeBelegung();
            }
        }
        // Bei Q1 auch die Folgebelegungen entsprechend setzen 
        if (halbjahr > 1) { //in der Q1
            let folgeHalbjahr = halbjahr + 1;
            while (folgeHalbjahr < 6 && this.belegungsBed.istGueltig(folgeHalbjahr, bel_neu)) { //gültig
                this.belegung[folgeHalbjahr] = bel_neu;
                folgeHalbjahr++;
            }
            PruefeBelegungsBedingungen.pruefeFachbelQ2_2_SOderM(this);
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
        return (this.belegungsBed.alsAbifach && this.belegung[5] != '' && this.belegung[5] != 'ZK');
    }

    /**
     * ermittelt ob das Fach in dem angegebenen Halbjahr regulär (nicht als ZK) gewählt werden kann
     * @param {Integer} halbjahr 
     */
    istWaehlbar(halbjahr) {
        // Es gibt keine Wahlart
        //debug_info("wahlarten: ",this.belegungsBed.wahlarten,"halbjahr",halbjahr);
        if (this.belegungsBed.wahlarten[halbjahr].length === 0) return false;
        // Fortgeführte Fremdsprache, die nicht in SekI belegt wurde
        if (this.istFFS && !this.istFFSSekI) return false;
        // darf hier neu einsetzen
        if (this.belegungsBed.einsetzend[halbjahr] === true) return true;
        // war im Halbjahr davor nicht belegt (und auch kein alternatives Fach)
        if (halbjahr > 0 && this.belegung[halbjahr - 1] === '') {
            //debug_info("Vorgängerfach suchen");
            if (this.belegungsBed.vorgaengerFaecher.some((krzl) => {
                //debug_info(" - Fach:", krzl);
                let fach = Controller.getInstance().wahlbogen.getFachMitKuerzel(krzl);
                return !(fach.belegung[halbjahr - 1] == '' || fach.belegung[halbjahr - 1] == 'ZK');
            })) return true; //es gibt ein belegtes Vorgängerfach
            return false;
        }
        // ansonsten spricht wohl nichts dagegen
        return true;
    }

    /**
     * prüft ob das Fach als Zusatzkurs wählbar ist
     * @param {Integer} halbjahr 
     * @returns true wenn in dem Halbjahr als ZK wählbar
     */
    istAlsZKWaehlbar(halbjahr) {
        // in diesem Halbjahr als Zusatzkurs wählbar
        return this.belegungsBed.wahlarten[halbjahr].includes('ZK')
    }

    /**
     * Prüft ob das Fach vom Starthalbjahr (incl) bis Endhalbjahr (excl) belegt war
     * @param {Integer} starthj Starthalbjahr (inklusive)
     * @param {Integer} endhj Endhalbjahr (exklusive)
     * @returns true wenn das Fach in der Zeit belegt ist
     */
    istBelegt(starthj, endhj) {
        return this.belegung.slice(starthj, endhj).every((e) => { return e != ""; });
    }

    /**
     * Prüft ob das Fach vom Starthalbjahr (incl) bis Endhalbjahr (excl) SCHRIFTLICH belegt ist
     * @param {Integer} starthj Starthalbjahr (inklusive)
     * @param {Integer} endhj Endhalbjahr (exklusive)
     * @returns true wenn das Fach in der Zeit SCHRIFTLICH (S oder LK) belegt ist
     */
    istSchriftlichBelegt(starthj, endhj) {
        return this.belegung.slice(starthj, endhj).every((e) => { return e == "S" || e == "LK"; });
    }

    /**
     * Prüft ob Belegungen in Halbjahren vorliegen, die nicht belegt werden
     * dürfen und korrigiert dies
     * @returns true - wenn eine korrektur stattgefunden hat
     */
    pruefeBelegung() {
        let found = false;
        for (let h = 0; h < 6; h++) {
            if (this.belegung[h] != '' && !this.istWaehlbar(h)) {
                this.belegung[h] = '';
                found = true;
            }
        }
        return found;
    }

    /**
     * prüft ob das Fach mit dem übergebenen Kürzel ein Vorgängerfach ist
     * @param {String} krzl 
     * @returns true, wenn krzl Vorgänger ist
     */
    hatVorgaenger(krzl) {
        return this.belegungsBed.vorgaengerFaecher.includes(krzl);
    }
    /**
     * gibt die zu wertende Stundenzahl im angebgebenen Halbjahr (0-5)
     * für LKs werden 5 Stunden zurück gegeben 
     * @param {Integer} halbjahr 0-5
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
        //debug_info("Hochschreiben Fach",this.bezeichnung);
        for (let i = halbjahr + 1; i < 6; i++) {
            if (this.belegungsBed.wahlarten[i].includes(this.belegung[i - 1])) {
                this.belegung[i] = this.belegung[i - 1];
            } else {
                this.belegung[i] = '';
            }
        }
        this.abifach = 0; //Sollte beim hochschreiben zurückgesetzt werden
    }

    /**
     * wählt das Fach vollständig ab
     */
    abwaehlen() {
        this.belegung = Array(6).fill('');
        this.abifach = 0;
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
            debug_info("Fach ", jsonObj.bezeichnung, " Krzl: ", jsonObj.kuerzel);
        } else {
            neueBlg = new Fachbelegung("Ungueltig", "--");
        }

        //statistik-Kuerzel
        if (typeof (jsonObj.statKuerzel) === 'string') {
            neueBlg.statKuerzel = jsonObj.statKuerzel;
        } else {
            neueBlg.statKuerzel = neueBlg.kuerzel;
        }

        //Belegung übernehmen
        if (typeof (jsonObj.belegung) === 'object' && Array.isArray(jsonObj.belegung) && jsonObj.belegung.length == 6) {
            neueBlg.belegung = jsonObj.belegung;
        } else {
            debug_info("Belegung in JSON-File Fehlerhaft");
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
        if (typeof (jsonObj.istFFS) === 'boolean') {
            neueBlg.istFFS = jsonObj.istFFS;
        }
        if (typeof (jsonObj.istFFSSekI) === 'boolean') {
            debug_info("json:", jsonObj.istFFSSekI);
            neueBlg.istFFSSekI = jsonObj.istFFSSekI;
        }

        //ist BiliSachfach
        if (typeof (jsonObj.istBili) === 'boolean') {
            neueBlg.istBili = jsonObj.istBili;
        } else { //Konvertierung von alten JSON-Files, die diesen Boolean noch nicht hatten
            if (["GEE", "EKE", "BIE"].includes(jsonObj.kuerzel)) {
                neueBlg.istBili = true;
            }
        }

        return neueBlg;
    }
}