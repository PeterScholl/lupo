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
        this.addFachToFachbelegungen("Geographie","Ek",['','','','','',''],"#58FA58");
        // Philosophie
        this.addFachToFachbelegungen("Philosophie","PP",['','','','','',''],"#58FA58");
        // Katholische Religion
        this.addFachToFachbelegungen("Kath. Religion","KR",['','','','','',''],"#58FA58");
        // Evangelische Religion
        this.addFachToFachbelegungen("Ev. Religion","ER",['','','','','',''],"#58FA58");
        // Mathematik #2E64FE
        this.addFachToFachbelegungen("Mathematik","M",['S','S','S','','',''], "#2E64FE");
        // Biologie
        this.addFachToFachbelegungen("Biologie","Bi",['','','','','',''], "#2E64FE");
        // Chemie
        this.addFachToFachbelegungen("Chemie","Ch",['','','','','',''], "#2E64FE");
        // Physik
        this.addFachToFachbelegungen("Physik","Ph",['','','','','',''], "#2E64FE");
        // Biologie
        this.addFachToFachbelegungen("Informatik","If",['','','','','',''], "#2E64FE");
        // Sport
        this.addFachToFachbelegungen("Sport","Sp",['','','','','',''], "#FEFEFE");
        // Projektkurs
        this.addFachToFachbelegungen("Projekt","PK",['','','','','',''], "#DDDDDD");
        
         

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