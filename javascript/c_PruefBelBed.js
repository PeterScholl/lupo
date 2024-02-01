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
            return "Geschichte und GeschichteEnglisch kann nicht gleichzeitig belegt werden<br>";
        }
        return "";
    }


}