/* In dieser Klasse wird der Wahlbogen abgebildet, er enthält alle Details einer Wahl
    z.B. die Fächer/Belegungen, Name der Person, Abiturjahrgang....
*/
class Wahlbogen {
    fachbelegungen = [];
    abiJahrgang = 2027;

    constructor() {
        this.abiJahrgang=2027;
    }

    erzeugeMinimaleFachbelegung() {
        // Deutsch(D)
        this.addFachToFachbelegungen("Deutsch","D",['S','S','','','','']);
        // Englisch
        this.addFachToFachbelegungen("Englisch","E",['S','S','','','','']);
        // Latein
        this.addFachToFachbelegungen("Latein","L6",['','','','','','']);
        // Französisch
        this.addFachToFachbelegungen("Französisch","F6",['','','','','','']);
        // Spanisch
        this.addFachToFachbelegungen("Spanisch","S6",['','','','','','']);
        // Spanisch neu
        this.addFachToFachbelegungen("Spanisch ab EF","S0",['','','','','','']);
        // Kunst
        this.addFachToFachbelegungen("Kunst","KU",['','','','','',''],"#FA5858");
        // Musik
        this.addFachToFachbelegungen("Musik","MU",['','','','','',''],"#FA5858");
        // Geschichte
        this.addFachToFachbelegungen("Geschichte","GE",['','','','','',''],"#58FA58");
        // Sozialwissenschaften
        this.addFachToFachbelegungen("Sozialwissenschaften","SW",['','','','','',''],"#58FA58");
        // Geographie
        this.addFachToFachbelegungen("Geographie","EK",['','','','','',''],"#58FA58");
        // Philosophie
        this.addFachToFachbelegungen("Philosophie","PP",['','','','','',''],"#58FA58");
        // Katholische Religion
        this.addFachToFachbelegungen("Kath. Religion","KR",['','','','','',''],"#58FA58");
        // Evangelische Religion
        this.addFachToFachbelegungen("Ev. Religion","ER",['','','','','',''],"#58FA58");
        // Mathematik #2E64FE
        this.addFachToFachbelegungen("Mathematik","M",['S','S','S','','',''], "#2E64FE");
        // Biologie
        this.addFachToFachbelegungen("Biologie","BI",['','','','','',''], "#2E64FE");
        // Chemie
        this.addFachToFachbelegungen("Chemie","CH",['','','','','',''], "#2E64FE");
        // Physik
        this.addFachToFachbelegungen("Physik","PH",['','','','','',''], "#2E64FE");
        // Biologie
        this.addFachToFachbelegungen("Informatik","IF",['','','','','',''], "#2E64FE");
        // Sport
        this.addFachToFachbelegungen("Sport","SP",['','','','','',''], "#FEFEFE");
        // Projektkurs
        this.addFachToFachbelegungen("Projekt","PK",['','','','','',''], "#DDDDDD");
        // Vertiefungsfach Mathe
        this.addFachToFachbelegungen("Mathe Vertiefung","M-VF",['','','','','',''], "#DDDDDD");
        // Vertiefungsfach Englsich
        this.addFachToFachbelegungen("Englisch Vertiefung","E-VF",['','','','','',''], "#DDDDDD");
        // Vertiefungsfach Deutsch
        this.addFachToFachbelegungen("Deutsch Vertiefung","D-VF",['','','','','',''], "#DDDDDD");

    }

    addFachToFachbelegungen(bezeichnung,kuerzel,belegung=['','','','','',''], bgcolor="#FA5858") {
        // TODO sinnhaftigkeit der Parameter prüfen
        // prüfe ob ein Fach mit dem Kürzel schon existiert
        if (this.getFachMitKuerzel(kuerzel)==null) {
        let fach = new Fachbelegung(bezeichnung,kuerzel);
        fach.belegung = [...belegung]; //wenn sinnvoll
        fach.bgcolor=bgcolor;
        this.fachbelegungen.push(fach);
        }
    }

    /**
     * gibt das Fach mit dem gesuchten Kürzel aus den fachbelegungen
     * @param {*} kuerzel - Kuerzel des gesuchten Fachs
     * @returns gibt das Fach mit dem Kürzel aus der Fachbelegung wieder oder null, wenn nicht vorhanden
     */
    getFachMitKuerzel(kuerzel) {
        let fach = this.fachbelegungen.find((e)=>{return e.kuerzel==kuerzel;});
        if (typeof(fach)==='undefined') return null;
        return fach;
    }
}