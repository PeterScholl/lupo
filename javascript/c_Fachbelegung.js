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
}