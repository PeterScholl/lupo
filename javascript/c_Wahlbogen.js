/** In dieser Klasse wird der Wahlbogen abgebildet, er enthält alle Details einer Wahl
    z.B. die Fächer/Belegungen, Name der Person, Abiturjahrgang....
*/
class Wahlbogen {
    name = "Nachname";
    vorname = "Vorname";
    fachbelegungen = [];
    abiJahrgang = 2027;

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
        // Latein
        this.addFachToFachbelegungen("Latein", "L6", ['', '', '', '', '', ''],  "FG1");
        // Französisch
        this.addFachToFachbelegungen("Französisch", "F6", ['', '', '', '', '', ''], "FG1");
        // Spanisch
        this.addFachToFachbelegungen("Spanisch", "S6", ['', '', '', '', '', ''], "FG1");
        // Spanisch neu
        this.addFachToFachbelegungen("Spanisch ab EF", "S0", ['', '', '', '', '', ''], "FG1");
        // Kunst
        this.addFachToFachbelegungen("Kunst", "KU", ['', '', '', '', '', ''], "FG1");
        // Musik
        this.addFachToFachbelegungen("Musik", "MU", ['', '', '', '', '', ''], "FG1");
        // Geschichte
        this.addFachToFachbelegungen("Geschichte", "GE", ['', '', '', '', '', ''], "FG2");
        // Sozialwissenschaften
        this.addFachToFachbelegungen("Sozialwissenschaften", "SW", ['', '', '', '', '', ''], "FG2");
        // Geographie
        this.addFachToFachbelegungen("Geographie", "EK", ['', '', '', '', '', ''], "FG2");
        // Philosophie
        this.addFachToFachbelegungen("Philosophie", "PP", ['', '', '', '', '', ''], "FG2");
        // Katholische Religion
        this.addFachToFachbelegungen("Kath. Religion", "KR", ['', '', '', '', '', ''], "FG2");
        // Evangelische Religion
        this.addFachToFachbelegungen("Ev. Religion", "ER", ['', '', '', '', '', ''], "FG2");
        // Mathematik #8db4e3
        this.addFachToFachbelegungen("Mathematik", "M", ['S', 'S', 'S', '', '', ''], "FG3");
        // Biologie
        this.addFachToFachbelegungen("Biologie", "BI", ['', '', '', '', '', ''], "FG3");
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
    addFachToFachbelegungen(bezeichnung, kuerzel, belegung = ['', '', '', '', '', ''], faecherGruppe="FG1") {
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
     * sucht die LK -Fächer
     * @returns Array mit den LK-Fächern
     */
    gibLKFaecher() {
        return this.fachbelegungen.filter((e) => {return e.istLK();});
    }
}