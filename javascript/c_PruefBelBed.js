/**
 * In dieser Klasse sollen alle Belegungsverpflichtungen geprüft werden
 */
class PruefeBelegungsBedingungen {
    static pruefeAlle(wahlbogen) {
        let bericht = "Anfang<br>";
        //1. Pruefe Deutsch durchgehend belegt
        bericht+=this.pruefeDeutschDurchgehend(wahlbogen);

        bericht += "<br>Ende";
        return bericht;
    }

    static pruefeDeutschDurchgehend(wahlbogen) {
        const fachDeutsch = wahlbogen.getFachMitKuerzel("D");
        if (!fachDeutsch.belegung.every((a) => {return a!='';})) {
            return "Das Fach Deutsch muss durchgehend von der EF.1 bis Q2.2 belegt werden<br>";
        }
        return "";
    }
}