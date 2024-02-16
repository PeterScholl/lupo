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
        bericht += this.ergaenzeBericht(this.pruefeFachMindEinDurchgehend(wahlbogen, "PH", "BI", "CH"));
        bericht += this.pruefeVerboteneFachKombinationen(wahlbogen);
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
        if (!this.istFachDurchgehend(wahlbogen,krz1)) {
            //console.log("Kürzel",krz1);
            return "Das Fach " + fach1.bezeichnung + " muss durchgehend von der EF.1 bis Q2.2 belegt werden";
        }
        return "";
    }

    /**
     * prueft ob ein Fach mit den Statistik-kürzel durchgehend belegt ist
     * @param {Wahlbogen} wahlbogen 
     * @param {String} statKrz 
     * @returns true oder false
     */
    static istFachDurchgehend(wahlbogen, statKrz) {
        const faecher = wahlbogen.gibFaecherMitStatKuerzel(statKrz);
        return faecher.some((f) => {return f.belegung.every((a) => { return a != ''; });})
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
        if (fach1==null || fach2 == null) {
            return "";
        }
        for (let i = 0; i < 6; i++) {
            if (fach1.belegung[i] != '' && fach2.belegung[i] != '') {
                //eine Doppelbelegung gefunden
                return fach1.bezeichnung + " und " + fach2.bezeichnung + " kann nicht gleichzeitig belegt werden";
            }
        }
        return "";
    }

    /**
     * prüft alle im Wahlbogen aufgelisteten verbotenen Fachkombinationen
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit den Fehlern und schon den span-Tags drum herumg aus ergaenzeBericht
     */
    static pruefeVerboteneFachKombinationen(wahlbogen) {
        let result = "";
        wahlbogen.verboteneFachKombis.forEach((e) => {
            debug_info("Pruefe Kombination ",e[0],e[1]);
            result+=this.ergaenzeBericht(this.pruefeDoppelteBelegung(wahlbogen,e[0],e[1]));
        });
        return result;
    }

    /**
     * Prüft ob ein Fach mit dem übergebenen Statistik-Kürzel durchgehend von der EF.1 bis in die Q1.2 oder
     * als Zusatzkurs belegt wurde
     * @param {*} wahlbogen der zu prüfende Wahlbogen
     * @param {*} krz1 das zu prüfende Statistik-Fachkürzel
     * @returns Leerstring oder String mit Belegungsinformation
     */
    static pruefeFachDurchgehendoderZusatzkurs(wahlbogen, krz1) {
        const faecher = wahlbogen.gibFaecherMitStatKuerzel(krz1);
        if (faecher.every((f) => {return !this.pruefeFachDurchgehendBelegtVonBis(f,0,4) && !(f.belegung[4] == 'ZK' && f.belegung[5] == 'ZK');})) {
            if (faecher.length == 0) {
                return "Das Fach " + krz1 + " muss durchgehend von der EF.1 bis Q1.2 oder als Zusatzkurs (in der Regel Q2.1 bis Q2.2) belegt werden";
            } else {
            return "Das Fach " + faecher[0].bezeichnung + " muss durchgehend von der EF.1 bis Q1.2 oder als Zusatzkurs (in der Regel Q2.1 bis Q2.2) belegt werden";
            }
        }
        return "";
    }

    static pruefeFachMindEinDurchgehend(wahlbogen, krz1, krz2, krz3) {
        const fach1d = this.istFachDurchgehend(wahlbogen,krz1); // boolean
        const fach2d = this.istFachDurchgehend(wahlbogen,krz2);
        const fach3d = this.istFachDurchgehend(wahlbogen,krz3);
        if (!(fach1d || fach2d || fach3d)) {
            return "Mind. eine klassiche NaWi (Physik, Chemie oder Biologie) muss durchgehend von der EF.1 bis Q2.2 belegt werden";
        }
        return "";
    }

    /**
     * prueft ob das übergebene Fach vom Hj von_hj (inkl) bis Hj bis_hj (exkl.) belegt war
     * @param {Fachbelegung} fach 
     * @param {Integer} von_hj 0-5 inklusive 
     * @param {Integer} bis_hj 1-6 exklusive
     * @returns true
     */
    static pruefeFachDurchgehendBelegtVonBis(fach,von_hj,bis_hj) {
        return fach.belegung.slice(von_hj,bis_hj).every((hj_belegung) => {return hj_belegung != '';});
    }

}
