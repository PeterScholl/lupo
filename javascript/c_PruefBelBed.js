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
        let bericht = "";
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehend(wahlbogen, "D"));
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehend(wahlbogen, "M"));
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehend(wahlbogen, "SP"));
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehendoderZusatzkurs(wahlbogen, "SW"));
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehendoderZusatzkurs(wahlbogen, "GE"));
        bericht += this.ergaenzeBericht(this.pruefeDoppelteBelegung(wahlbogen, "GE", "GEE"));
        bericht += this.ergaenzeBericht(this.pruefeDoppelteBelegung(wahlbogen, "BI", "BIE"));
        bericht += this.ergaenzeBericht(this.pruefeDoppelteBelegung(wahlbogen, "EK", "EKE"));
        bericht += this.ergaenzeBericht(this.pruefeDoppelteBelegung(wahlbogen, "KR", "ER"));
        return bericht;
    }

    /**
     * funktion die beim Ergänzen des Berichts mittels den einzelnen Prüfmethoden ein
     * HTML-Span-Tag drum herum setzt - dies ermöglicht ggf. auch, dass man die
     * Ergebnisse anklicken kann
     * @param {String} erg Resultat, dass in einen <span> gepackt werden soll 
     * @returns String der den inhalt in einen <span>-Block gepackt hat.
     */
    static ergaenzeBericht(erg) {
        if (erg != '') {
            return "<span class='belegmeldung' onclick='Controller.getInstance().objectClickedToggleClass(this,\"highlight\")'>" + erg + "</span><br>";
        } else {
            return "";
        }
    }

    /**
     * prüft die Belegungsbedingung ob Deutsch durchgehend von der EF.1 bis Q2.2 belegt wurde
     * @param {*} wahlbogen der zu prüfende Wahlbogen
     * @returns String mit der Meldung falls nicht Bedingung nicht erfüllt, sonst Leerstring.
     */
    static pruefeFachDurchgehend(wahlbogen, krz1) {
        const fach1 = wahlbogen.getFachMitKuerzel(krz1);
        if (!fach1.belegung.every((a) => { return a != ''; })) {
            return "Das Fach " + fach1.bezeichnung + " muss durchgehend von der EF.1 bis Q2.2 belegt werden";
        }
        return "";
    }

    /**
     * prueft ob im Wahlbogen die Fächer mit den Kürzeln krz1 und krz2 gleichzeitig belegt sind
     * @param {Wahlbogen} wahlbogen der zu prüfende Wahlbogen 
     * @param {String} krz1 Fachkürzel des ersten zu prüfenden Fachs 
     * @param {String} krz2 Fachkürzel des zweiten zu prüfenden Fachs
     * @returns Leerstring oder String mit Belegungsinformation
     */
    static pruefeDoppelteBelegung(wahlbogen, krz1, krz2) {
        const fach1 = wahlbogen.getFachMitKuerzel(krz1);
        const fach2 = wahlbogen.getFachMitKuerzel(krz2);
        let valid = true;
        for (let i = 0; i < 6; i++) {
            if (fach1.belegung[i] != '' && fach2.belegung[i] != '') {
                valid = false;
                break;
            }
        }
        if (!valid) {
            return fach1.bezeichnung + " und " + fach2.bezeichnung + " kann nicht gleichzeitig belegt werden";
        }
        return "";
    }

    /**
     * Prüft ob das Fach mit dem übergebenen Kürzel durchgehend von der EF.1 bis in die Q1.2 oder
     * als Zusatzkurs belegt wurde
     * @param {*} wahlbogen der zu prüfende Wahlbogen
     * @param {*} krz1 das zu prüfende Fachkürzel
     * @returns Leerstring oder String mit Belegungsinformation
     */
    static pruefeFachDurchgehendoderZusatzkurs(wahlbogen, krz1) {
        const fach1 = wahlbogen.getFachMitKuerzel(krz1);
        if (!fach1.belegung.slice(0, 4).every(function (a) { return a != ''; }) && (fach1.belegung[4] != 'ZK' && fach1.belegung[5] != 'ZK')) {
            return "Das Fach " + fach1.bezeichnung + " muss durchgehend von der EF.1 bis Q1.2 oder als Zusatzkurs (in der Regel Q2.1 bis Q2.2) belegt werden";
        }
        return "";
    }

}
