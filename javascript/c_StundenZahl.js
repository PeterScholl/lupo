/**
 * In dieser Klasse soll geprüft werden, ob genug Stunden gewählt wurden
 */

class StundenZahl {

    constructor() {
    }  
        erzeugestundenzahl() {
            this.addjahrtoStundenzahl("Wochenstunden", [EF1, EF2, Q11, Q12, Q21, Q22], "#FFFFF");
            this.addJahrtoStundenzahl("Durchscnitt", ['E-Phase', 'Q-Phase'], "#FFFFF");
        }


    addFachToFachbelegungen(bezeichnung = ['', '', '', '', '', ''], bgcolor = "#FA5858") {
        // TODO sinnhaftigkeit der Parameter prüfen
        // prüfe ob ein Fach mit dem Kürzel schon existiert
        if (this.getFachMitKuerzel(kuerzel) == null) {
            let fach = new Fachbelegung(bezeichnung, kuerzel);
            fach.belegung = [...belegung]; //wenn sinnvoll
            fach.bgcolor = bgcolor;
            this.fachbelegungen.push(fach);
        }
    }




}