/** In dieser Klasse wird der Wahlbogen abgebildet, er enthält alle Details einer Wahl
    z.B. die Fächer/Belegungen, Name der Person, Abiturjahrgang....
*/
class Wahlbogen {
    name = "Nachname";
    vorname = "Vorname";
    fachbelegungen = [];
    abiJahrgang = 2027;
    verboteneFachKombis = []; //enthält verbotene Fächerkombinationen als Array von zwei Kürzeln, z.B. ['GE','GEE']

    /**
     * im Konstruktor werden die Basisdaten festgelegt
     */
    constructor() {
        this.abiJahrgang = 2027;
    }

    /**
     * Methode um einen Wahlbogen mit einem Ausgangsfachangebot anzulegen
     */
    erzeugeMinimaleFachbelegung() {
        // Deutsch(D)
        this.addFachToFachbelegungen("Deutsch", "D", ['S', 'S', '', '', '', ''], "FG1D");
        // Englisch
        this.addFachToFachbelegungen("Englisch", "E", ['S', 'S', '', '', '', ''], "FG1");
        const e = this.getFachMitKuerzel('E');
        e.istFFS = true; //Englisch ist fortgeführte Fremdsprache
        e.istFFSSekI = true;
        // Latein
        this.addFachToFachbelegungen("Latein", "L6", ['', '', '', '', '', ''], "FG1");
        const l6 = this.getFachMitKuerzel('L6');
        l6.istFFS = true; //Latein ist fortgeführte Fremdsprache
        // Französisch
        this.addFachToFachbelegungen("Französisch", "F6", ['', '', '', '', '', ''], "FG1");
        const f6 = this.getFachMitKuerzel('F6');
        f6.istFFS = true; //Französisch ist fortgeführte Fremdsprache
        f6.istFFSSekI = true;
        // Spanisch
        this.addFachToFachbelegungen("Spanisch", "S6", ['', '', '', '', '', ''], "FG1");
        const s6 = this.getFachMitKuerzel('S6');
        s6.istFFS = true; //Spanisch ist fortgeführte Fremdsprache
        // Spanisch neu
        this.addFachToFachbelegungen("Spanisch ab EF", "S0", ['', '', '', '', '', ''], "FG1");
        // Kunst
        this.addFachToFachbelegungen("Kunst", "KU", ['', '', '', '', '', ''], "FG1");
        // Musik
        this.addFachToFachbelegungen("Musik", "MU", ['', '', '', '', '', ''], "FG1");
        // Geschichte
        this.addFachToFachbelegungen("Geschichte", "GE", ['', '', '', '', '', ''], "FG2");
        let ge = this.getFachMitKuerzel('GE');
        ge.belegungsBed.wahlarten[5].push('ZK');
        ge.belegungsBed.wahlarten[4].push('ZK');
        ge.belegungsBed.vorgaengerFaecher.push('GEE');
        // Geschichte Englisch
        this.addFachToFachbelegungen("Geschichte Englisch", "GEE", ['', '', '', '', '', ''], "FG2");
        this.verboteneFachKombis.push(['GE', 'GEE']);
        let gee = this.getFachMitKuerzel('GEE');
        gee.belegungsBed.vorgaengerFaecher.push('GE');
        // Sozialwissenschaften
        this.addFachToFachbelegungen("Sozialwissenschaften", "SW", ['', '', '', '', '', ''], "FG2");
        let sw = this.getFachMitKuerzel('SW');
        sw.belegungsBed.wahlarten[5].push('ZK');
        sw.belegungsBed.wahlarten[4].push('ZK');
        // Geographie
        this.addFachToFachbelegungen("Geographie", "EK", ['', '', '', '', '', ''], "FG2");
        // Geographie Englisch
        this.addFachToFachbelegungen("Geographie Englisch", "EKE", ['', '', '', '', '', ''], "FG2");
        // Philosophie
        this.addFachToFachbelegungen("Philosophie", "PP", ['', '', '', '', '', ''], "FG2");
        let pp = this.getFachMitKuerzel('PP');
        pp.belegungsBed.vorgaengerFaecher=['KR','ER'];
        // Katholische Religion
        this.addFachToFachbelegungen("Kath. Religion", "KR", ['', '', '', '', '', ''], "FG2");
        let kr = this.getFachMitKuerzel('KR');
        kr.belegungsBed.vorgaengerFaecher=['PP','ER'];
        // Evangelische Religion
        this.addFachToFachbelegungen("Ev. Religion", "ER", ['', '', '', '', '', ''], "FG2");
        let er = this.getFachMitKuerzel('ER');
        er.belegungsBed.vorgaengerFaecher=['KR','PP'];
        // Mathematik #8db4e3
        this.addFachToFachbelegungen("Mathematik", "M", ['S', 'S', 'S', '', '', ''], "FG3");
        // Biologie
        this.addFachToFachbelegungen("Biologie", "BI", ['', '', '', '', '', ''], "FG3");
        // Biologie Englisch
        this.addFachToFachbelegungen("Biologie Englisch", "BIE", ['', '', '', '', '', ''], "FG3");
        // Chemie
        this.addFachToFachbelegungen("Chemie", "CH", ['', '', '', '', '', ''], "FG3");
        // Physik
        this.addFachToFachbelegungen("Physik", "PH", ['', '', '', '', '', ''], "FG3");
        // Biologie
        this.addFachToFachbelegungen("Informatik", "IF", ['', '', '', '', '', ''], "FG3");
        // Sport
        this.addFachToFachbelegungen("Sport", "SP", ['', '', '', '', '', ''], "FGSp");
        let sport = this.getFachMitKuerzel("SP");
        sport.belegungsBed.alsAbifach = false;
        // Projektkurs
        this.addFachToFachbelegungen("Projekt", "PK", ['', '', '', '', '', ''], "FGPK");
    }

    /**
     * ergänzt eine Fachbelegung im Wahlbogen - achtet dabei darauf, dass kein Kürzel doppelt vorkommt
     * @param {*} bezeichnung Bezeichnung des Faches
     * @param {*} kuerzel Kürzel des Faches - soll eindeutig sein
     * @param {*} belegung die Belegung (Standardvorgabe alle 6 Halbjahre leer '')
     * @param {*} bgcolor die Hintergrundfarbe in HTML für das Fach
     */
    addFachToFachbelegungen(bezeichnung, kuerzel, belegung = ['', '', '', '', '', ''], faecherGruppe = "FG1") {
        // TODO sinnhaftigkeit der Parameter prüfen
        // prüfe ob ein Fach mit dem Kürzel schon existiert
        if (this.getFachMitKuerzel(kuerzel) == null) {
            let fach = new Fachbelegung(bezeichnung, kuerzel);
            fach.belegung = [...belegung]; //wenn sinnvoll
            fach.faecherGruppe = faecherGruppe;
            this.fachbelegungen.push(fach);
        }
    }

    /**
     * gibt das Fach mit dem gesuchten Kürzel aus den fachbelegungen
     * @param {*} kuerzel - Kuerzel des gesuchten Fachs
     * @returns gibt das Fach mit dem Kürzel aus der Fachbelegung wieder oder null, wenn nicht vorhanden
     */
    getFachMitKuerzel(kuerzel) {
        let fach = this.fachbelegungen.find((e) => { return e.kuerzel == kuerzel; });
        if (typeof (fach) === 'undefined') return null;
        return fach;
    }

    /**
     * ändert das Abifach mit dem angegebenen Kürzel
     * wenn dieses Fach noch nicht Abifach ist 
     *   wenn Abifach3 nicht vorhanden - von 0 auf 3 (wenn 3 nicht vorhanden)
     *   wenn Abifach3 vorhanden aber Abifach 4 nicht - von 0 auf 4
     *   sonst von 0 auf 3 und 3 auf 4 und 4 auf 0
     * wenn dieses Fach Abifach ist
     *   von 3 auf 4 und 4 ggf auf 3
     *   von 4 auf 0
     * @param {*} krzl 
     */
    aendereAbifach(krzl) {
        let diesesFach = this.getFachMitKuerzel(krzl);
        let abi3 = this.gibAbifach(3);
        let abi4 = this.gibAbifach(4);
        if (diesesFach == null || diesesFach.istLK()) return;
        if (diesesFach.abifach > 2) { //dieses ist Abifach
            if (diesesFach.abifach == 3) {
                diesesFach.abifach = 4;
                if (abi4 != null) abi4.abifach = 3;
            } else { //dieses ist viertes Abifach
                diesesFach.abifach = 0;
            }
        } else { //dieses Fach ist noch kein Abifach
            if (abi3 != null) { //Es gibt schon ein drittes Abifach
                if (abi4 != null) { // und auch ein viertes
                    diesesFach.abifach = 3;
                    abi3.abifach = 4;
                    abi4.abifach = 0;
                } else { //drittes aber kein viertes
                    diesesFach.abifach = 4;
                }
            } else { // noch kein drittes Abifach
                diesesFach.abifach = 3;
            }
        }
    }

    /**
     * gibt das erste (und i.d.R. einzige) Fach mit der gesuchten Abifachnummer
     * @param {Integer} nr Abifach-Nummer 1-4
     * @returns das erste Fach mit diesem Wert als Abifach oder null
     */
    gibAbifach(nr) {
        let fach = this.fachbelegungen.find((f) => { return f.abifach === nr; });
        if (typeof (fach) === 'undefined') return null;
        return fach;
    }

    /**
     * sucht die LK -Fächer
     * @returns Array mit den LK-Fächern
     */
    gibLKFaecher() {
        return this.fachbelegungen.filter((e) => { return e.istLK(); });
    }

    /**
     * sucht die Fächer, die fortgeführte Fremdsprachen sind
     * @returns Array mit Fächern die FFS sind
     */
    gibFortgefuehrteFS() {
        return this.fachbelegungen.filter((e) => { return e.istFFS; });
    }

    /**
     * gibt alle Fächer die das Fach mit übergebenem Kürzel als Vorgänger haben
     * - nicht jedoch das Fach selbst
     * @param {String} krzl 
     * @returns Array mit Fachbelegungen
     */
    gibFaecherMitVorgaenger(krzl) {
        return this.fachbelegungen.filter((e) => { return e.hatVorgaenger(krzl); });
    }
    /**
     * setzt für die beieden Abifächer die "richtige" Abifachnummer 1 oder 2
     */
    setzeLKAbifachNr() {
        let lks = this.gibLKFaecher();
        if (lks.length == 1) {
            lks[0].abifach = 2; // 2 ist nie falsch ;-)
            Controller.getInstance().redrawZeile(lks[0].kuerzel);
        } else if (lks.length == 2) {
            // entscheide für lks[0]
            if (['D', 'M', 'BI', 'PH', 'CH'].includes(lks[0].kuerzel || lks[0].istFFS)) {
                lks[0].abifach = 1;
            } else {
                lks[0].abifach = 2;
            }
            // lks[1] bekommt die andere Nr.
            lks[1].abifach = 3 - lks[0].abifach;
            Controller.getInstance().redrawZeile(lks[0].kuerzel);
            Controller.getInstance().redrawZeile(lks[1].kuerzel);
        }
    }

    /**
     * Schreibt für alle Fächer die Belegung vom übergebenen Halbjahr an hoch
     * @param {Integer} halbjahr (0-5)
     */
    hochschreibenVon(halbjahr) {
        this.fachbelegungen.forEach((f) => { f.hochschreibenVon(halbjahr); });
    }
}