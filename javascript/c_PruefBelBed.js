/**
 * In dieser Klasse sollen alle Belegungsverpflichtungen geprüft werden
 */
class PruefeBelegungsBedingungen {
    /**
     * ruft alle programmierten Belegprüfungen auf und erstellt einen Gesamtbericht im HTML-Format
     * @param {*} wahlbogen Wahlbogen der geprüft werden soll 
     * @returns String mit dem Bericht
     */
    static pruefeAlle(wahlbogen) {
        let bericht = "Anfang<br>";
        //1. Pruefe Deutsch durchgehend belegt
        bericht += this.pruefeDeutschDurchgehend(wahlbogen);
        bericht += this.pruefeDoppeltGeschichte(wahlbogen);
        bericht += this.pruefeDoppeltBiologie(wahlbogen);
        bericht += "<br>Ende";
        return bericht;
    }

    /**
     * prüft die Belegungsbedingung ob Deutsch durchgehend von der EF.1 bis Q2.2 belegt wurde
     * @param {*} wahlbogen der zu prüfende Wahlbogen
     * @returns String mit der Meldung falls nicht Bedingung nicht erfüllt, sonst Leerstring.
     */
    static pruefeDeutschDurchgehend(wahlbogen) {
        const fachDeutsch = wahlbogen.getFachMitKuerzel("D");
        if (!fachDeutsch.belegung.every((a) => { return a != ''; })) {
            return "Das Fach Deutsch muss durchgehend von der EF.1 bis Q2.2 belegt werden<br>";
        }
        return "";
    }

    static pruefeDoppeltGeschichte(wahlbogen) {
        const fachGeschichte = wahlbogen.getFachMitKuerzel("GE");
        const fachGeschichteEnglisch = wahlbogen.getFachMitKuerzel("GEE");
        let valid = true;
        for (let i = 0; i < 6; i++) {
            if (fachGeschichte.belegung[i]!='' && fachGeschichteEnglisch.belegung[i]!= ''){
            valid = false;
            break;
            } 
        }
        if (!valid) {
            let f1 = Controller.getInstance().wahlbogen.getFachMitKuerzel("GE");
            return f1.bezeichnung +" und Geschichte Englisch kann nicht gleichzeitig belegt werden<br>";
        }
        return "";
    }
    static pruefeDoppeltBiologie(wahlbogen) {
        const fachBiologie = wahlbogen.getFachMitKuerzel("BI");
        const fachBiologieEnglisch = wahlbogen.getFachMitKuerzel("BIE");
        let valid = true;
        for (let i = 0; i < 6; i++) {
            if (fachBiologie.belegung[i]!='' && fachBiologieEnglisch.belegung[i]!= ''){
            valid = false;
            break;
            } 
        }
        if (!valid) {
            return "Biologie und Biologie Englisch kann nicht gleichzeitig belegt werden<br>";
        }
        return "";
    }



}