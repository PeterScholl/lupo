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
        bericht += this.pruefeFachDurchgehend(wahlbogen, "D");
        bericht += this.pruefeFachDurchgehend(wahlbogen, "M");
        bericht += this.pruefeDoppelteBelegung(wahlbogen, "GE","GEE");
        bericht += this.pruefeDoppelteBelegung(wahlbogen, "BI","BIE");
        bericht += this.pruefeDoppelteBelegung(wahlbogen, "EK","EKE");
        bericht += this.pruefeDoppelteBelegung(wahlbogen, "KR","ER");
        bericht += "<br>Ende";
        return bericht;
    }

    /**
     * prüft die Belegungsbedingung ob Deutsch durchgehend von der EF.1 bis Q2.2 belegt wurde
     * @param {*} wahlbogen der zu prüfende Wahlbogen
     * @returns String mit der Meldung falls nicht Bedingung nicht erfüllt, sonst Leerstring.
     */
    static pruefeFachDurchgehend(wahlbogen,krz1) {
        const fach1 = wahlbogen.getFachMitKuerzel(krz1);
        if (!fach1.belegung.every((a) => { return a != ''; })) {
            return "Das Fach " + fach1.bezeichnung  + " muss durchgehend von der EF.1 bis Q2.2 belegt werden<br>";
        }
        return "";
    }

    static pruefeDoppelteBelegung(wahlbogen,krz1,krz2) {
        const fach1 = wahlbogen.getFachMitKuerzel(krz1);
        const fach2 = wahlbogen.getFachMitKuerzel(krz2);
        let valid = true;
        for (let i = 0; i < 6; i++) {
            if (fach1.belegung[i]!='' && fach2.belegung[i]!= ''){
            valid = false;
            break;
            } 
        }
        if (!valid) {
            return fach1.bezeichnung + " und " + fach2.bezeichnung + " kann nicht gleichzeitig belegt werden<br>";
        }
        return "";
    }
    
    }
