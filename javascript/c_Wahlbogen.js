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
        this.addFachToFachbelegungen("Deutsch", "D", ['S', 'S', '', '', '', ''], "#FDE9D9");
        // Englisch
        this.addFachToFachbelegungen("Englisch", "E", ['S', 'S', '', '', '', ''], "#FDDDC3");
        // Latein
        this.addFachToFachbelegungen("Latein", "L6", ['', '', '', '', '', ''], "#fdddc3");
        // Französisch
        this.addFachToFachbelegungen("Französisch", "F6", ['', '', '', '', '', ''], "#fdddc3");
        // Spanisch
        this.addFachToFachbelegungen("Spanisch", "S6", ['', '', '', '', '', ''], "#fdddc3");
        // Spanisch neu
        this.addFachToFachbelegungen("Spanisch ab EF", "S0", ['', '', '', '', '', ''], "#fdddc3");
        // Kunst
        this.addFachToFachbelegungen("Kunst", "KU", ['', '', '', '', '', ''], "#fccca5");
        // Musik
        this.addFachToFachbelegungen("Musik", "MU", ['', '', '', '', '', ''], "#fccca5");
        // Geschichte
        this.addFachToFachbelegungen("Geschichte", "GE", ['', '', '', '', '', ''], "#eaf1de");
        // Sozialwissenschaften
        this.addFachToFachbelegungen("Sozialwissenschaften", "SW", ['', '', '', '', '', ''], "#eaf1de");
        // Geographie
        this.addFachToFachbelegungen("Geographie", "EK", ['', '', '', '', '', ''], "#eaf1de");
        // Philosophie
        this.addFachToFachbelegungen("Philosophie", "PP", ['', '', '', '', '', ''], "#eaf1de");
        // Katholische Religion
        this.addFachToFachbelegungen("Kath. Religion", "KR", ['', '', '', '', '', ''], "#d7e4bc");
        // Evangelische Religion
        this.addFachToFachbelegungen("Ev. Religion", "ER", ['', '', '', '', '', ''], "#d7e4bc");
        // Mathematik #8db4e3
        this.addFachToFachbelegungen("Mathematik", "M", ['S', 'S', 'S', '', '', ''], "#c5d9f1");
        // Biologie
        this.addFachToFachbelegungen("Biologie", "BI", ['', '', '', '', '', ''], "#8db4e3");
        // Chemie
        this.addFachToFachbelegungen("Chemie", "CH", ['', '', '', '', '', ''], "#8db4e3");
        // Physik
        this.addFachToFachbelegungen("Physik", "PH", ['', '', '', '', '', ''], "#8db4e3");
        // Biologie
        this.addFachToFachbelegungen("Informatik", "IF", ['', '', '', '', '', ''], "#8db4e3");
        // Sport
        this.addFachToFachbelegungen("Sport", "SP", ['', '', '', '', '', ''], "#FEFEFE");
        // Projektkurs
        this.addFachToFachbelegungen("Projekt", "PK", ['', '', '', '', '', ''], "#DDDDDD");
    }

    /**
     * ergänzt eine Fachbelegung im Wahlbogen - achtet dabei darauf, dass kein Kürzel doppelt vorkommt
     * @param {*} bezeichnung Bezeichnung des Faches
     * @param {*} kuerzel Kürzel des Faches - soll eindeutig sein
     * @param {*} belegung die Belegung (Standardvorgabe alle 6 Halbjahre leer '')
     * @param {*} bgcolor die Hintergrundfarbe in HTML für das Fach
     */
    addFachToFachbelegungen(bezeichnung, kuerzel, belegung = ['', '', '', '', '', ''], bgcolor = "#FA5858") {
        // TODO sinnhaftigkeit der Parameter prüfen
        // prüfe ob ein Fach mit dem Kürzel schon existiert
        if (this.getFachMitKuerzel(kuerzel) == null) {
            let fach = new Fachbelegung(bezeichnung, kuerzel);
            fach.belegung = [...belegung]; //wenn sinnvoll
            fach.bgcolor = bgcolor;
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
}