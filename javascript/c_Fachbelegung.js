/* In dieser Klasse wird ein Fach und die Fachwahl/Belegung verwaltet
diese Belegung kann auch leer sein...
*/
class Fachbelegung {
    bezeichnung = "Deutsch";
    kuerzel = "D"
    belegung = ['','','','','','']; //nicht belegt
    belegungsBed = new BelegBed(); // Stundenzahl, M,S,LK,ZK möglich
    bgcolor="#DF0101";

    constructor(bezeichnung, kuerzel) {
        this.bezeichnung=bezeichnung;
        this.kuerzel=kuerzel;
    }

    /**
     * Setzt die Belegung für das angebene Halbjahr auf den nächsten gültigen Wert
     * und ab Q1 auch die Folgehalbjahre auf den gleichen Wert
     * 
     * @param {*} halbjahr 0-5 in dem die Belegung hochgesetzt werden soll
     */
    setzeBelegungWeiter(halbjahr) {
        const bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr,this.belegung[halbjahr]);
        this.belegung[halbjahr] = bel_neu;
        //TODO Bei Q1 auch die Folgebelegungen entsprechend setzen
        if (halbjahr>1) { //in der Q1
            let folgeHalbjahr = halbjahr+1;
            while (folgeHalbjahr<6 && this.belegungsBed.istGueltig(folgeHalbjahr,bel_neu)) { //gültig
                this.belegung[folgeHalbjahr]=bel_neu;
                folgeHalbjahr++;
            }
        }
    }
}