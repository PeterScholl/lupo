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
     * @param {Number} halbjahr in welchem Halbjahr soll die folgeBelegung ermittelt werden
     * @param {char} aktBeleg  ist die aktuelle Belegung
     */
    gibNaechsteBelegungsmöglichkeit(halbjahr, aktBeleg) {
        if (Number.isInteger(halbjahr) && halbjahr> 0 && halbjahr < 7) { //gültiges Halbjahr
            this.wahlarten[halbjahr-1].indexOf
        }
        return 'M'; //immer gültig

    }
}