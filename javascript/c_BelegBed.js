/* In dieser Klasse werden Belegunsbedingungen für Fächer verwaltet
   Stundenzahlen in jedem Halbjahr (LK zählt immer 5)
   als M,S,LK,ZK
*/
class BelegBed {
    

    constructor() {
        this.wahlarten=[];
        this.wahlarten.push(['M','S']); //Wahlmöglichkeiten für EF1
        this.wahlarten.push(['M','S']); //Wahlmöglichkeiten für EF2
        this.wahlarten.push(['M','S','LK']); //Wahlmöglichkeiten für Q1.1
        this.wahlarten.push(['M','S','LK']); //Wahlmöglichkeiten für Q1.2
        this.wahlarten.push(['M','S','LK']); //Wahlmöglichkeiten für Q2.1
        this.wahlarten.push(['M','S','LK']); //Wahlmöglichkeiten für Q2.2
        this.stundenzahlen=[3,3,3,3,3,3]; //Stundenzahlen für die 6 Halbjahre
    }

    /**
     * 
     * @param {Number} halbjahr in welchem Halbjahr (0-5) soll die folgeBelegung ermittelt werden
     * @param {char} aktBeleg  ist die aktuelle Belegung
     */
    gibNaechsteBelegungsmöglichkeit(halbjahr, aktBeleg) {
        if (Number.isInteger(halbjahr) && halbjahr>= 0 && halbjahr < 6) { //gültiges Halbjahr
            let aktpos = this.wahlarten[halbjahr].indexOf(aktBeleg);
            const anzWahlarten = this.wahlarten[halbjahr].length;
            if (anzWahlarten >0 && aktpos+1<anzWahlarten) {
                return this.wahlarten[halbjahr][aktpos+1];
            }
        }
        return ''; //immer gültig
    }

    /**
     * prüft ob die übergebene Belegung im angegebenen Halbjahr zulässig ist
     * eine leere Belegung ist immer gültig
     * @param {*} halbjahr 
     * @param {*} belegung 
     * @returns true, wenn zulässig sonst false
     */
    istGueltig(halbjahr,belegung) {
        if (belegung=='') {
            return true; //Leere Belegung ist immer gültig
        }
        if (halbjahr>=0 && halbjahr<6) {
            return this.wahlarten[halbjahr].includes(belegung);
        }
        console.log("Fehler: ungültiges Halbjahr in ist Gueltig abgefragt",halbjahr,belegung);
        return false;
    }
}