// test.js
// Vorlage bzw. Idee von https://javascript.info/testing-mocha
// Wichtige Infos zu den Asserts
// https://www.chaijs.com/api/assert/

describe('Philosophie-Tests', () => {
    it('Philosophie muss durch zwei Klicks in der EF1 abgewählt werden können', async () => {
        const wb1 = await wahlbogenFromJSONURL("./mochatestfiles/pl_test_1_start.json");
        let fach = wb1.getFachMitKuerzel('PL');
        fach.setzeBelegungWeiter(0, wb1);
        fach.setzeBelegungWeiter(0, wb1);
        const wb2 = await wahlbogenFromJSONURL("./mochatestfiles/pl_test_1_result.json");
        //console.log("deep equal:",isDeepEqual(wb1.fachbelegungen,wb2.fachbelegungen));
        assert.deepEqual(wb1.fachbelegungen, wb2.fachbelegungen, "Fehlerhaftes Ergebnis");
    });

    it('Philosophie durchgänging wird auf KR in der Q1 und ER in der Q2 umgewählt', async () => {
        const wb3 = await wahlbogenFromJSONURL("./mochatestfiles/pl_test_1_start.json");

        let fach = wb3.getFachMitKuerzel('PL');
        fach.setzeBelegungWeiter(2, wb3); //Philosophie wird in der Q1.1 abgwählt
        fach.setzeBelegungWeiter(2, wb3);
        fach = wb3.getFachMitKuerzel('KR');
        fach.setzeBelegungWeiter(2, wb3); //KR anwählen
        fach.setzeBelegungWeiter(4, wb3); //KR auf S
        fach.setzeBelegungWeiter(4, wb3); //KR abwählen
        fach = wb3.getFachMitKuerzel('ER');
        fach.setzeBelegungWeiter(4, wb3); //ER anwählen

        const wb4 = await wahlbogenFromJSONURL("./mochatestfiles/pl_test_2_result.json");
        //console.log("deep equal:",isDeepEqual(wb3.fachbelegungen,wb4.fachbelegungen));
        assert.deepEqual(wb3.fachbelegungen, wb4.fachbelegungen, "Fehlerhaftes Ergebnis");
    });
});

describe('Belegungsprüfungstests', () => {
    it('Nicht-Belegung von Religion bzw. Kunst und Musik wird erkannt', async () => {
        const wb1 = await wahlbogenFromJSONURL("./mochatestfiles/bel_test_relKuMu_start.json");
        let Rel = PruefeBelegungsBedingungen.pruefeReligionOderErsatzfach(wb1);
        let KuMu = PruefeBelegungsBedingungen.pruefeKuMu(wb1);
        //console.log("deep equal:",isDeepEqual(wb1.fachbelegungen,wb2.fachbelegungen));
        assert.notEqual(Rel,"");
        assert.notEqual(KuMu,"");
    });
});
/*
describe('Lock Class Tests 2', () => {
    it('Lock should be closed by default', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.isOpen, false);
    });

    it('Try key on lock', () => {
        const myLock = new Lock('MyLock', '1234');
        const isKeyValid = myLock.tryKeyOnLock('1234');
        assert.equal(isKeyValid, true);
        assert.equal(myLock.isOpen, true);
    });

    it('Get lock name', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.name, 'MyLock');
    });

    it('Set and get lock status', () => {
        const myLock = new Lock('MyLock', '1234');
        assert.equal(myLock.isOpen, false);

        myLock.isOpen = true;
        assert.equal(myLock.isOpen, true);
    });
});
*/
