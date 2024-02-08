/** In dieser Klasse wird ein Fach und die Fachwahl/Belegung verwaltet
diese Belegung kann auch leer sein...
*/
class Fachbelegung {
    bezeichnung = "Deutsch";
    kuerzel = "D"
    belegung = ['', '', '', '', '', '']; //nicht belegt
    belegungsBed = new BelegBed(); // Stundenzahl, M,S,LK,ZK möglich
    bgcolor = "#DF0101";

    constructor(bezeichnung, kuerzel) {
        this.bezeichnung = bezeichnung;
        this.kuerzel = kuerzel;
    }

    /**
     * Setzt die Belegung für das angebene Halbjahr auf den nächsten gültigen Wert
     * und ab Q1 auch die Folgehalbjahre auf den gleichen Wert
     * 
     * @param {*} halbjahr 0-5 in dem die Belegung hochgesetzt werden soll
     */
    setzeBelegungWeiter(halbjahr) {
        const bel_neu = this.belegungsBed.gibNaechsteBelegungsmöglichkeit(halbjahr, this.belegung[halbjahr]);
        this.belegung[halbjahr] = bel_neu;
        // Bei Q1 auch die Folgebelegungen entsprechend setzen
        if (halbjahr > 1) { //in der Q1
            let folgeHalbjahr = halbjahr + 1;
            while (folgeHalbjahr < 6 && this.belegungsBed.istGueltig(folgeHalbjahr, bel_neu)) { //gültig
                this.belegung[folgeHalbjahr] = bel_neu;
                folgeHalbjahr++;
            }
        }
    }

    /**
     * gibt die zu wertende Stundenzahl im angebgebenen Halbjahr (0-5)
     * für LKs werden 5 und ZKs 2 Stunden zurück gegeben + sonder Fälle bei Fächern wie VF
     * @param {*} halbjahr 0-5
     * @returns Stundenzahl für dieses Halbjahr
     */
    gibStundenzahlImHalbjahr(halbjahr) {
        if (halbjahr >= 0 && halbjahr < 6 && this.belegung[halbjahr] != '') {
            if (this.belegung[halbjahr] == 'LK') {
                return 5;
            } else {
            if (this.belegung[halbjahr] == 'ZK'){
                return 2;
            } else 
                return this.belegungsBed.stundenzahlen[halbjahr];
            }
        }
        return 0;
    }

    /**
     * Methode um eine Fachbelegung von einem JSONObj zu generieren
     * @param {} jsonObj 
     * @return neue Fachbelegung
     */
    static generateFromJSONObj(jsonObj) {
        let belBed = null;
        // Bezeichnung und Kürzel übernehmen
        if (typeof(jsonObj.bezeichnung) === 'string' && typeof(jsonObj.kuerzel) === 'string') {
            belBed = new Fachbelegung(jsonObj.bezeichnung, jsonObj.kuerzel);
            console.log("Fach ",jsonObj.bezeichnung," Krzl: ",jsonObj.kuerzel);
        } else {
            belBed = new Fachbelegung("Ungueltig","--");
        }

        //Belegung übernehmen
        if (typeof(jsonObj.belegung) === 'object' && Array.isArray(jsonObj.belegung) && jsonObj.belegung.length == 6) {
            belBed.belegung = jsonObj.belegung;
        } else {
            console.log("Belegung in JSON-File Fehlerhaft");
        }

        //Belegungsbedingungen übernehmen
        if (typeof(jsonObj.belegungsBed)==='object') {
            belBed.belegungsBed = BelegBed.generateFromJSONObj(jsonObj.belegungsBed);
        }

        //BGColor übernehmen
        if (typeof(jsonObj.bgcolor)==='string') {
            belBed.bgcolor = jsonObj.bgcolor;
        }
        
        return belBed;
    }
}