/** In dieser Klasse werden Belegunsbedingungen für Fächer verwaltet
   Stundenzahlen in jedem Halbjahr (LK zählt immer 5)
   als M,S,LK,ZK
*/
class BelegBed {

    constructor() {
        /**
         * enthält für jedes der 6 Halbjahre eine Liste von Strings die 
         * als Bezeichnung einer Wahl in dem entsprechenden Halbjahr erlaubt sind
         * @type string[][]
         */
        this.wahlarten = [];
        this.wahlarten.push(['M', 'S']); //Wahlmöglichkeiten für EF1
        this.wahlarten.push(['M', 'S']); //Wahlmöglichkeiten für EF2
        this.wahlarten.push(['M', 'S', 'LK']); //Wahlmöglichkeiten für Q1.1
        this.wahlarten.push(['M', 'S', 'LK']); //Wahlmöglichkeiten für Q1.2
        this.wahlarten.push(['M', 'S', 'LK']); //Wahlmöglichkeiten für Q2.1
        this.wahlarten.push(['M', 'S', 'LK']); //Wahlmöglichkeiten für Q2.2
        /**
         * gibt für jedes der 6 Halbjahre an, mit wie vielen Stunden das Fach belegt wird
         * in der Regel 3
         * @type Integer[]
         */
        this.stundenzahlen = [3, 3, 3, 3, 3, 3]; //Stundenzahlen für die 6 Halbjahre
        /**
         * gibt an, in welchen Halbjahren das Fach neu einsetzen darf
         * Standardmäßig nur in EF.1
         * Falls die Belegung ZK enthält darf auch in dem entsprechenden Halbjahr begonnen werden
         * wenn hier nicht true steht
         * @type Boolean[]
         */
        this.einsetzend = [true, false, false, false, false, false]; // In welchen Halbjahren darf begonnen werden
        /**
         * gibt an welche Fächer ggf. als Vorgängerbelegung erlaubt sind, z.B. bei KR auch ER und PP oder 
         * bei BIE auch BI...
         * @type String[]
         */
        this.vorgaengerFaecher = []; //Fächer die als Vorgänger betrachtet werden dürfen (KR,ER,PP, BIE,BI, ...)
        /**
         * gibt an ob dieses Fach als 3. oder 4. Abifach erlaubt ist (z.B. bei Sport könnte das verboten sein)
         * @type boolean
         */
        this.alsAbifach = true;
    }

    /**
     * 
     * @param {Number} halbjahr in welchem Halbjahr (0-5) soll die folgeBelegung ermittelt werden
     * @param {char} aktBeleg  ist die aktuelle Belegung
     */
    gibNaechsteBelegungsmöglichkeit(halbjahr, aktBeleg) {
        if (Number.isInteger(halbjahr) && halbjahr >= 0 && halbjahr < 6) { //gültiges Halbjahr
            let aktpos = this.wahlarten[halbjahr].indexOf(aktBeleg);
            const anzWahlarten = this.wahlarten[halbjahr].length;
            if (anzWahlarten > 0 && aktpos + 1 < anzWahlarten) {
                return this.wahlarten[halbjahr][aktpos + 1];
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
    istGueltig(halbjahr, belegung) {
        if (belegung == '') {
            return true; //Leere Belegung ist immer gültig
        }
        if (halbjahr >= 0 && halbjahr < 6) {
            return this.wahlarten[halbjahr].includes(belegung);
        }
        console.log("Fehler: ungültiges Halbjahr in ist Gueltig abgefragt", halbjahr, belegung);
        return false;
    }

    /**
     * Methode um eine Belegungsbedingung von einem JSONObj zu generieren
     * @param {} jsonObj 
     * @return neue Belegungsbedingung
     */
    static generateFromJSONObj(jsonObj) {
        let belBed = new BelegBed();
        if (typeof (jsonObj.wahlarten) === 'object' && Array.isArray(jsonObj.wahlarten) && jsonObj.wahlarten.length == 6) {
            belBed.wahlarten = jsonObj.wahlarten;
        } else {
            console.error("Fehler bei Belegungsbedingungen");
        }
        if (typeof (jsonObj.stundenzahlen) === 'object' && Array.isArray(jsonObj.stundenzahlen) && jsonObj.stundenzahlen.length == 6) {
            belBed.stundenzahlen = jsonObj.stundenzahlen;
        } else {
            console.error("Fehler bei Stundenzahlen");
        }
        if (typeof (jsonObj.einsetzend) === 'object' && Array.isArray(jsonObj.einsetzend) && jsonObj.einsetzend.length == 6) {
            belBed.einsetzend = jsonObj.einsetzend;
        } else {
            console.error("Fehler bei Einsetzend");
        }
        //Vorgängerfächer
        if (typeof (jsonObj.vorgaengerFaecher) === 'object' && Array.isArray(jsonObj.vorgaengerFaecher)) {
            belBed.vorgaengerFaecher = jsonObj.vorgaengerFaecher;
        } else {
            console.error("Fehler bei Vorgänerfächer");
        }
        //als Abifach möglich
        if (typeof (jsonObj.alsAbifach) === 'boolean') {
            belBed.alsAbifach = jsonObj.alsAbifach;
        } else {
            console.error("Fehler bei als Abifach");
        }

        return belBed;
    }
}