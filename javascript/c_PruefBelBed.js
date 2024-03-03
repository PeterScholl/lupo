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
        bericht += this.ergaenzeBericht(this.pruefeEF10KurseImHalbjahr(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehend(wahlbogen, "D"));
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehend(wahlbogen, "M"));
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehend(wahlbogen, "SP"));
        bericht += this.ergaenzeBericht(this.pruefeReligionOderErsatzfach(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeEineFS(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeFSSekI(wahlbogen));
        // Teil von Philipp und Björn
        bericht += this.ergaenzeBericht(this.pruefeQPhasezweiLKS(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeQ7KurseImHalbjahr(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeStundenanzahlunter102(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeQDurschnittWstunden34(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeEFDurschnittWstunden34(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeQPhase38Kurse(wahlbogen));
        // Ende Teil PuB
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehendoderZusatzkurs(wahlbogen, "SW"));
        bericht += this.ergaenzeBericht(this.pruefeFachDurchgehendoderZusatzkurs(wahlbogen, "GE"));
        bericht += this.ergaenzeBericht(this.pruefeFachMindEinDurchgehend(wahlbogen, "PH", "BI", "CH"));
        bericht += this.ergaenzeBericht(this.pruefeZweiNaWiOderZweiFS(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeKuMu(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeZweiMalDMFSunterAbifaechern(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeVierAbiturfaecherIn3Aufgabenfeldern(wahlbogen));
        bericht += this.pruefeVerboteneFachKombinationen(wahlbogen);

        return bericht;
    }

    /**
     * ruft alle prgrammierten Klausurbelegprüfungen auf erstellt einen Gesamtbericht
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Bericht
     */
    static pruefeAlleKlausurBed(wahlbogen) {
        let bericht = "";
        bericht += this.ergaenzeBericht(this.pruefeEineDurchgehendeFSschriftlich(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeEineDurchgehendeGesellschaftswissenschaftoderReligionSchriftlich(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeKlassischeNawiInEFschriftlich(wahlbogen));
        bericht += this.ergaenzeBericht(this.pruefeObAbifaecherSchriftlich(wahlbogen));
        return bericht;
    }

    /**
     * ruft alle prgrammierten Informationen auf erstellt einen Gesamtbericht
     * @param {*} wahlbogen 
     */
    static pruefeAlleInfoBed(wahlbogen) {
        let bericht = "";
        bericht += this.ergaenzeBericht(this.pruefeStundenbandbreite(wahlbogen));
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
            // alte Version - highlight bei onclick
            // return "<span class='belegmeldung' onclick='Controller.getInstance().objectClickedToggleClass(this,\"highlight\")'>" + erg + "</span><br>";
            // tooltip by hover
            return "<span class='tooltip'>" + erg + "<div class='tooltiptext'>" + erg + "</div></span><br>";
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
        if (!this.istFachDurchgehend(wahlbogen, krz1)) {
            //console.log("Kürzel",krz1);
            return "Das Fach " + fach1.bezeichnung + " muss durchgehend von der EF.1 bis Q2.2 belegt werden";
        }
        return "";
    }

    static pruefeReligionOderErsatzfach(wahlbogen) {
        // Religionsfächer bestimmen KR,ER,PP
        // Strategie 1-3
        // 1. Prüfe ob Religion belegt -> Alles gut
        // TODO: gibt es noch weitere Religionen?
        const religionsKuerzel = ["KR", "ER"];
        let relFaecher = religionsKuerzel.map((k) => { return wahlbogen.getFachMitKuerzel(k); });
        relFaecher.filter((f) => { return f != null; });
        //console.dir("relFaecher", relFaecher);
        let relBelegungen = relFaecher.map((f) => { return f.belegung; });
        //console.dir("relBelegungen", relBelegungen);
        let gesamtbelegung = this.mergeBelegungen(relBelegungen);

        if (gesamtbelegung.slice(0, 4).every((b) => { return b != ''; })) return ""; //Reli ist normal belegt
        // 2. Ist Philosophie der Ersatz?
        const pp = wahlbogen.getFachMitKuerzel("PL");
        if (pp != null) {
            gesamtbelegung = this.mergeBelegungen([gesamtbelegung, pp.belegung]);
            if (gesamtbelegung.slice(0, 4).every((b) => { return b != ''; })) {
                //PP ist Ersatzfach
                // 3. Ist Philosophie die einzig durchgehende Gesellschaftswissenschaft
                if (pp.istBelegt(0, 6)) { // könnte einzige GeWi sein
                    let gewis = wahlbogen.fachbelegungen.filter((f) => { return f.faecherGruppe.startsWith("FG2"); });
                    //Alle durchgehend belegte Gesellschaftswissenschaften außer PP 
                    gewis = gewis.filter((f) => { return f.statKuerzel != "PL"; })
                        .filter((e) => { return e.istBelegt(0, 6); });
                    if (gewis.length > 0) {
                        return ""; // es gibt noch eine andere
                    }
                } else {
                    return "";
                }
            }
        }
        return "Religion muss wenigstens von EF.1-Q1.2 durchgehend belegt werden. " +
            "Als Ersatz kann Philosophie dienen, sofern diese nicht die einzige von " +
            "EF.1 bis Q2.2 durchgehend belegte Gesellschaftswissenschaft ist. " +
            "In diesem Fall muss ein weiteres Fach der Gesellschaftswissenschaften " +
            "als Religionsersatz dienen.";
    }

    /**
     * prueft ob zwei Naturwissenschaften oder zwei Fremdsprachen durchgehend belegt wurden
     * @param {Wahlbogen} wahlbogen 
     * @returns Leerstring oder String mit Fehlerbeschreibung
     */
    static pruefeZweiNaWiOderZweiFS(wahlbogen) {
        //Alle Fremdsprachen, die durchgehend belegt sind
        let fs = wahlbogen.fachbelegungen.filter((f) => { return f.faecherGruppe === "FG1FS" || f.istBili; })
            .filter((e) => { return e.istBelegt(0, 6); });
        //Alle NaWis außer Mathe, die durchgehend belegt sind
        let nawi = wahlbogen.fachbelegungen.filter((f) => { return f.faecherGruppe.startsWith("FG3"); })
            .filter((f) => { return f.statKuerzel != "M"; })
            .filter((e) => { return e.istBelegt(0, 6); });
        if (fs.length >= 2 || nawi.length >= 2) {
            //Schriftlichkeit  prüfen
            if (fs.filter((f) => { return f.istSchriftlichBelegt(0, 5); }).length >= 2 ||
                nawi.filter((f) => { return f.istSchriftlichBelegt(2, 5); }).length >= 1) {
                return "";
            }
        }
        return "Es müssen durchgehend zwei Naturwissenschaften oder zwei "
            + "Fremdsprachen belegt werden, hierbei ist eine Naturwissenschaft "
            + "oder zwei Fremdsprachen schriftlich zu belegen "
            + "(zu den Fremdsprachen zählen auch in einer weiteren Fremdsprache "
            + "unterrichtete Sachfächer)";
    }

    /**
     * Prüfung auf: Mindestens eines der Fächer Kunst oder Musik muss von EF.1 bis 
     * wenigstens Q1.2 durchgehend belegt werden. In der Q-Phase kann auch alternativ
     * Literatur, VP oder IP belegt werden
     * @param {Wahlbogen} wahlbogen 
     * @returns Leerstring oder Fehlertext
     */
    static pruefeKuMu(wahlbogen) {
        //Prüfe Ku oder Mu in der EF
        let kumu = wahlbogen.fachbelegungen.filter((e) => { return e.faecherGruppe === "FG1KuMu" && e.istBelegt(0, 1); })
        if (kumu.length > 0) {
            //Q1 prüfen
            kumu = wahlbogen.fachbelegungen.filter((e) => { return ["KU", "MU", "LI", "VP", "IP"].includes(e.statKuerzel); })
                .filter((e) => { return e.istBelegt(2, 4); });
            if (kumu.length > 0) return ""; //alles gut
        }

        return "Mindestens eines der Fächer Kunst oder Musik muss von EF.1 "
            + "bis wenigstens Q1.2 durchgehend belegt werden. In der Q-Phase "
            + "kann auch alternativ Literatur, Vokalpraxis oder "
            + "Instrumentalpraxis belegt werden";
    }

    /**
     * Prüfung auf: Mindestens eine Fremdsprache muss von EF.1 bis Q2.2 
     * durchgehend belegt werden. Handelt es sich um eine neu ensetzende 
     * Fremdsprache, so muss zusätzich mindestens aus der Sekundarstufe I
     * fortgeführte Fremdsprache von EF.1 bis EF.2 belegt werden 
     * @param {Wahlbogen} wahlbogen 
     * @returns Leerstring oder String mit Fehlermeldung
     */
    static pruefeEineFS(wahlbogen) {
        // belegte Fremdsprachen
        let fs = wahlbogen.fachbelegungen.filter((e) => { return e.faecherGruppe.startsWith("FG1FS"); })
            .filter((e) => { return e.istBelegt(0, 1); });
        if (fs.filter((e) => { return e.istBelegt(0, 6); }).length > 0) {
            //es gibt mind. eine durchgehend belegte Fremdsprache
            // prüfung: in EF gibt es eine fortgeführte Fremdsprache
            if (fs.filter((e) => { return e.istFFS && e.istBelegt(0, 2); }).length > 0) {
                return ""; // alles gut
            }
        }

        return "Mindestens eine Fremdsprache muss von EF.1 bis Q2.2 durchgehend "
            + "belegt werden. Handelt es sich um eine neu ensetzende Fremdsprache, "
            + "so muss zusätzich mindestens aus der Sekundarstufe I fortgeführte "
            + "Fremdsprache von EF.1 bis EF.2 belegt werden";
    }

    /**
     * Prüfung auf Bei fehlender zweiter Fremdsprache muss eine neueinsetzende 
     * Fremdsprache durchgehend schriftlich belegt werden
     * @param {Wahlbogen} wahlbogen 
     * @returns Leerstring oder Fehlerbeschreibung
     */
    static pruefeFSSekI(wahlbogen) {
        let ffs = wahlbogen.fachbelegungen.filter((e) => { return e.istFFSSekI; });
        if (ffs.length >= 2) {
            return ""; // zwei Fremdsprachen in der Sek I belegt - alles gut
        }
        if (ffs.length == 1) {
            //nur eine fortgeführte FS aus der Sek I - prüfe ob neue durchgehend belegt
            let neuefs = wahlbogen.fachbelegungen
                .filter((e) => { return e.faecherGruppe.startsWith("FG1FS") && !e.istFFSSekI; })
                .filter((e) => { return e.istSchriftlichBelegt(0, 5); })
                .filter((e) => { return e.istBelegt(5, 6); });
            if (neuefs.length > 0) {
                return "";
            }
        }
        return "Bei fehlender zweiter Fremdsprache muss eine neueinsetzende "
            + "Fremdsprache durchgehend schriftlich belegt werden";
    }

    /**
     * prueft ob ein Fach mit den Statistik-kürzel durchgehend belegt ist
     * @param {Wahlbogen} wahlbogen 
     * @param {String} statKrz 
     * @returns true oder false
     */
    static istFachDurchgehend(wahlbogen, statKrz) {
        const faecher = wahlbogen.gibFaecherMitStatKuerzel(statKrz);
        return faecher.some((f) => { return f.belegung.every((a) => { return a != ''; }); })
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
        if (fach1 == null || fach2 == null) {
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
            debug_info("Pruefe Kombination ", e[0], e[1]);
            result += this.ergaenzeBericht(this.pruefeDoppelteBelegung(wahlbogen, e[0], e[1]));
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
        if (faecher.every((f) => { return !this.istFachDurchgehendBelegtVonBis(f, 0, 4) && !(f.belegung[4] == 'ZK' && f.belegung[5] == 'ZK'); })) {
            if (faecher.length == 0) {
                return "Das Fach " + krz1 + " muss durchgehend von der EF.1 bis Q1.2 oder als Zusatzkurs (in der Regel Q2.1 bis Q2.2) belegt werden";
            } else {
                return "Das Fach " + faecher[0].bezeichnung + " muss durchgehend von der EF.1 bis Q1.2 oder als Zusatzkurs (in der Regel Q2.1 bis Q2.2) belegt werden";
            }
        }
        return "";
    }

    static pruefeFachMindEinDurchgehend(wahlbogen, krz1, krz2, krz3) {
        const fach1d = this.istFachDurchgehend(wahlbogen, krz1); // boolean
        const fach2d = this.istFachDurchgehend(wahlbogen, krz2);
        const fach3d = this.istFachDurchgehend(wahlbogen, krz3);
        if (!(fach1d || fach2d || fach3d)) {
            return "Mindestens eine klassische Naturwissenschaft (Physik, Chemie oder Biologie) muss durchgehend von der EF.1 bis Q2.2 belegt werden";
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
    static istFachDurchgehendBelegtVonBis(fach, von_hj, bis_hj) {
        return fach.belegung.slice(von_hj, bis_hj).every((hj_belegung) => { return hj_belegung != ''; });
    }

    /**
     * prueft ob das übergebene Fach vom Hj von_hj (inkl) bis Hj bis_hj (exkl.) schriftl belegt war
     * @param {Fachbelegung} fach 
     * @param {Integer} von_hj 0-5 inklusive 
     * @param {Integer} bis_hj 1-6 exklusive
     * @returns true
     */
    static istFachDurchgehendSchriftlichBelegtVonBis(fach, von_hj, bis_hj) {
        return fach.belegung.slice(von_hj, bis_hj).every((hj_belegung) => { return hj_belegung == 'S' || hj_belegung == 'LK'; });
    }

    /**
     * prueft ob eine durchgehend belegte Fremdsprache von EF.1 bis Q2.1 schriftlich belegt ist
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehlertext oder Leertext
     */
    static pruefeEineDurchgehendeFSschriftlich(wahlbogen) {
        let fs = wahlbogen.fachbelegungen.filter((e) => { return e.faecherGruppe === "FG1FS"; })
            .filter((e) => { return this.istFachDurchgehendBelegtVonBis(e, 0, 5); })
            .filter((e) => { return this.istFachDurchgehendSchriftlichBelegtVonBis(e, 0, 4) });
        if (fs.length == 0) {
            return "Mindestens eine durchgehend belegte Fremdsprache muss von EF.1 bis Q2.1 schriftlich belegt sein.";
        }
        return "";
    }

    /**
     * prueft ob das dritte und vierte Abifach in der Q-Phase schriftlich belegt sind
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehlertext oder Leertext
     */
    static pruefeObAbifaecherSchriftlich(wahlbogen) {
        let fs = wahlbogen.fachbelegungen.filter((e) => { return e.abifach > 2; })
            .filter((e) => { return this.istFachDurchgehendSchriftlichBelegtVonBis(e, 2, 5) });
        if (fs.length != 2) {
            return "Das dritte und vierte Abifach müssen von der Q1.1 bis Q2.1 schrifltich belegt sein.";
        }
        return "";
    }

    /**
     * prueft ob in EF.1 und EF.2 eine klassische Naturwissenschaft (FG3 nicht M oder IF)
     * schriftlich belegt ist   
     * @param {Wahlbogen} wahlbogen 
     * @returns Leerstring oder Fehlertext
     */
    static pruefeKlassischeNawiInEFschriftlich(wahlbogen) {
        let kNaWi = wahlbogen.fachbelegungen.filter((e) => { return e.faecherGruppe === "FG3"; })
            .filter((e) => { return e.statKuerzel != 'M' && e.statKuerzel != 'IF'; });
        if (kNaWi.some((e) => { return e.belegung[0] === 'S'; })) { //in EF.1 eine schriftlich
            if (kNaWi.some((e) => { return e.belegung[1] === 'S'; })) { // in EF.2 auch eine S
                return ""; //alles gut
            }
        }
        return "In EF.1 und EF.2 muss mindestens eine klassische Naturwissenschaft schriftlich belegt sein."

    }

    /**
     * prueft ob eine durchgehend belegte Gesellschaftswissenschaft oder Religionslehre von EF.1 bis Q2.1 schriftlich belegt ist
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehlertext oder Leertext
     */
    static pruefeEineDurchgehendeGesellschaftswissenschaftoderReligionSchriftlich(wahlbogen) {
        let fs = wahlbogen.fachbelegungen.filter((e) => { return e.faecherGruppe.startsWith("FG2"); })
            .filter((e) => { return this.istFachDurchgehendBelegtVonBis(e, 0, 5); })
            .filter((e) => { return this.istFachDurchgehendSchriftlichBelegtVonBis(e, 2, 4) });
        if (fs.length == 0) {
            return "Mindestens eine durchgehend belegte Gesellschaftswissenschaft oder Religionslehre muss von Q1.1 bis Q2.1 schriftlich belegt sein.";
        }
        return "";
    }

    /**
     * prüft ob unter den vier Abifächern zwei der Fächer D,M, FS (2x FS geht nicht)
     * @param {Wahlbogen} wahlbogen
     * @returns String mit dem Fehlertext 
     */
    static pruefeZweiMalDMFSunterAbifaechern(wahlbogen) {
        const abifaecher = this.gibAbifaecher(wahlbogen);
        let erfolge = 0;
        //prüfe auf D,M,FS
        if (abifaecher.some((e) => { return e.statKuerzel === 'D'; })) erfolge++;
        if (abifaecher.some((e) => { return e.statKuerzel === 'M'; })) erfolge++;
        if (abifaecher.some((e) => { return e.faecherGruppe == "FG1FS"; })) erfolge++;
        if (erfolge < 2) {
            return "Unter den vier Abiturfächern müssen zwei Fächer D, M oder Fremdsprache sein";
        }
        return "";
    }

    /**
     * Prüft ob vier Abifächer gewählt wurden und alle drei Aufgabenfelder abgedeckt sind
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit der Fehlberbeschreibung (falls notwendig)
     */
    static pruefeVierAbiturfaecherIn3Aufgabenfeldern(wahlbogen) {
        const abifaecher = this.gibAbifaecher(wahlbogen);
        if (abifaecher.length == 4) { // es gibt schonmal 4
            debug_info("abifächer", abifaecher);
            //Pruefe Aufgabenfeld 1
            debug_info("Pruefe Abifächer auf Aufabenfeld 1");
            if (abifaecher.some((e) => { return e.faecherGruppe === 'FG1D' || e.faecherGruppe === 'FG1FS'; })) {
                //Pruefe Aufgabenfeld 2
                debug_info("Pruefe Abifächer auf Aufabenfeld 2");
                if (abifaecher.some((e) => { return e.faecherGruppe.startsWith('FG2') })) {
                    //Prufe Aufgabenfeld 3
                    debug_info("Pruefe Abifächer auf Aufabenfeld 3");
                    if (abifaecher.some((e) => { return e.faecherGruppe.startsWith('FG3'); })) {
                        return "";
                    }
                }
            }
        }
        return "Die Abifächer müssen alle drei Aufgabenfelder abdecken. Insgesamt sind vier Abifächer zu belegen";
    }


    /**
     * gibt ein Array der aktuell gewählten Abifächer zurück
     * @param {Wahlbogen} wahlbogen 
     * @returns Array der derziet gewählten Fächer
     */
    static gibAbifaecher(wahlbogen) {
        let abifaecher = wahlbogen.gibLKFaecher();
        let a3 = wahlbogen.gibAbifach(3);
        if (a3 != null) abifaecher.push(a3);
        let a4 = wahlbogen.gibAbifach(4);
        if (a4 != null) abifaecher.push(a4);
        return abifaecher;
    }

    /**
     * prüft ob in der Einführungsphase in jedem Halbjahr mindestens 10 Kurse belegt werden
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehler wenn nötig
     */
    static pruefeEF10KurseImHalbjahr(wahlbogen) {
        if (wahlbogen.getKurseFuershalbjahr(0) < 10 || wahlbogen.getKurseFuershalbjahr(1) < 10) {
            return "In der Einführungsphase müssen in jedem Halbjahr mindestens 10 Kurse belegt werden. Vertiefungskurse werden nicht mitgezählt";
        }
        return "";
    }

    /**
     * prüft ob in der Qualifikationsphase mindestens 38 anrechenbare Kurse belegt werden
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehler wenn nötig
     */
    static pruefeQPhase38Kurse(wahlbogen) {
        if (wahlbogen.getKurseFuershalbjahr(2) + wahlbogen.getKurseFuershalbjahr(3) + wahlbogen.getKurseFuershalbjahr(4) + wahlbogen.getKurseFuershalbjahr(5) < 38) {
            return "In der Qualifikationsphase müssen mindestens 38 anrechenbare Kurse belegt werden";
        }
        return "";
    }
    /**
     * prüft ob die durschnittliche Wochenstundenzahl in der Einführungsphase mindestens 34 Stunden beträgt
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehler wenn nötig
     */
    static pruefeEFDurschnittWstunden34(wahlbogen) {
        if (wahlbogen.getStundenDurchschnittFuerEPhase() < 34) {
            return "Die durschnittliche Wochenstundenzahl muss in der Einführungsphase mindestens 34 Stunden betragen";
        }
        return "";
    }
    /**
     * prüft ob die durschnittliche Wochenstundenzahl in der Qualifikationsphase mindestens 34 Stunden beträgt
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehler wenn nötig
     */
    static pruefeQDurschnittWstunden34(wahlbogen) {
        if (wahlbogen.getStundenDurchschnittFuerQPhase() < 34) {
            return "Die durschnittliche Wochenstundenzahl muss in der Qualifikationsphase mindestens 34 Stunden betragen";
        }
        return "";
    }
    
    /**
     * prüft ob die Anzahl aller Stunden mindestens 102 beträgt
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehler wenn nötig
     */
    static pruefeStundenanzahlunter102(wahlbogen) {
        let stundenzahl = 0;
        for (let i = 0; i < 6; i++) {
            stundenzahl += wahlbogen.getStundenFuershalbjahr(i);
        }
        if (stundenzahl/2 < 102) {
            return "Der Pflichtunterricht darf 102 Stunden nicht unterschreiten";
        } else
            return "";
    }
    /**
     * prüft ob in der Qualifikationsphase in jedem Halbjahr mindestens 7 Grundkurse belegt werden
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehler wenn nötig
     */
    static pruefeQ7KurseImHalbjahr(wahlbogen) {
        let gkurszahlen = [0, 0, 0, 0, 0, 0];
        wahlbogen.fachbelegungen.forEach((fach) => {
            for (let hj = 2; hj < 6; hj++) {
                if (fach.belegung[hj] != '' && fach.belegung[hj] != 'LK') {
                    gkurszahlen[hj] += 1;
                }
            }
        });
        for (let hj = 2; hj < 6; hj++) {
            if (gkurszahlen[hj] < 7) {
                return "In der Qualifikationsphase müssen in jedem Halbjahr mindestens 7 Grundkurse belegt werden";
            }
        }
        return "";
    }
    /**
     * prüft ob in der Qualifikationsphase zwei Fächer durchgehend als LKs belegt sind
     * @param {Wahlbogen} wahlbogen 
     * @returns String mit dem Fehler wenn nötig
     */
    static pruefeQPhasezweiLKS(wahlbogen) {
        let LKS = 0;
        wahlbogen.fachbelegungen.forEach((fach) => {
            if (fach.belegung[2] == 'LK' && fach.belegung[3] == 'LK' && fach.belegung[4] == 'LK' && fach.belegung[5] == 'LK')
                LKS += 1;
        });
        if (LKS != 2) {
            return "In der Q-Phase müssen zwei Fächer durchgehend in LKs belegt werden"
        } else
            return "";
    }

    /**
     * fügt mehrere Belegungen (Array mit 6 einträgen zusammen)
     * @param {*} belegungenArray 
     * @returns Array of Strings mit 'M' wenn dieses Halbjahr belegt 
     */
    static mergeBelegungen(belegungenArray) {
        if (belegungenArray === null || belegungenArray.length === 0) return new Array(6).fill('');
        let gesamtbelegung = new Array(6).fill("");
        belegungenArray.forEach((b) => {
            b.forEach((v, i) => {
                if (v != "") {
                    gesamtbelegung[i] = 'M'; //halbjahr belegt
                }
            });
        });
        return gesamtbelegung;
    }

    /**
     * prüft für jedes Halbjahr ob die Stundenbandbreite zwischen 32 und 36 liegt
     * @param {Wahlbogen} wahlbogen 
     * @returns Leerstring oder String mit Fehlerinfo
     */
    static pruefeStundenbandbreite(wahlbogen) {
        if ([0, 1, 2, 3, 4, 5].some((hj) => {
            return (wahlbogen.getStundenFuershalbjahr(hj) < 32 || wahlbogen.getStundenFuershalbjahr(hj) > 36);
        })) {
            return "Die Stundenbandbreite sollte pro Halbjahr 32 bis 36 Stunden betragen, um eine gleichmäßige Stundenbelastung zu gewährleisten";
        }
        return "";
    }

    /**
     * setzt die S,M-Belegung in Q2.2 entsprechend des Abifaches
     * @param {*} wahlbogen 
     */
    static setzeQ2_2SMEntsprAbifach(wahlbogen) {
        wahlbogen.fachbelegungen.forEach((e) => {
            PruefeBelegungsBedingungen.pruefeFachbelQ2_2_SOderM(e);
        })
    }

    /**
     * prueft fuer dieses Fach ob die Belegung in Q2.2 nur
     * im dritten Abifach schriftlich ist.
     * @param {Fachbelegung} fach 
     */
    static pruefeFachbelQ2_2_SOderM(fach) {
        if (fach != null && fach.belegung[5] != '' && ["S", "M"].includes(fach.belegung[5])) {
            //Fach ist in Q2.2 belegt und entweder S oder M
            if (fach.abifach === 3) { //drittes Abifach
                fach.belegung[5] = 'S';
            } else {
                fach.belegung[5] = 'M';
            }
        }
    }
}
