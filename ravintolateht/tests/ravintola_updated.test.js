import { describe, it, expect } from 'vitest';
import ravintola_updated from '../ravintola_updated.js';

describe('syoRavintolassa', () => {
  it('palauttaa taulukon, kun asiakkaita on paikkojen määrän verran tai vähemmän', () => {
    const asiakkaidenMaara = 5; // alle paikkojen määrän (paikkojenMaara = 15)
    
    const tulos = ravintola_updated.syoRavintolassa(asiakkaidenMaara);

    // Tarkistetaan, että palautusarvo on taulukko
    expect(Array.isArray(tulos)).toBe(true);

    // Tarkistetaan, että taulukon pituus vastaa asiakasmäärää
    expect(tulos.length).toBe(asiakkaidenMaara);

    // Tarkistetaan, että jokainen tilaus on objekti, jossa on summa ja ruoat
    tulos.forEach(t => {
      expect(t).toHaveProperty('summa');
      expect(t).toHaveProperty('ruoat');
      expect(Array.isArray(t.ruoat)).toBe(true);
    });
  });
});

describe('syoRavintolassa paikkojen riittävyys', () => {
  it('toisen kutsun tulisi epäonnistua, jos paikkoja ei riitä', () => {
    // Alustetaan paikat
    ravintola_updated.generoiPaikat();

    // Ensimmäinen kutsu: 10 asiakasta, onnistuu
    const ensimmainen = ravintola_updated.syoRavintolassa(10);
    expect(Array.isArray(ensimmainen)).toBe(true);
    expect(ensimmainen.length).toBe(10);

    // Toisen kutsun: 6 asiakasta, epäonnistuu, koska jäljellä vain 5 paikkaa
    const toinenKutsu = () => ravintola_updated.syoRavintolassa(6);

    // Tarkistetaan, että palauttaa undefined
    expect(toinenKutsu()).toBe(undefined);

    // Jos halutaan tarkistaa virheilmoitus varauksessa, voisi käyttää expect(...).toThrowError()
    // Esim. jos varaaPaikat heittäisi virheen tyypistä riippuen
  });
});


describe('laskeLasku', () => {
  it('laskee summan oikein valituille ruoille', () => {
    // Esimerkki tilaus: alkuruoka + pääruoka + jälkiruoka + juoma
    const tilaus = ['Tomaattikeitto', 'Kalakeitto', 'Jäätelö', 'Kahvi'];

    const summa = ravintola_updated.laskeLasku(tilaus);

    // Tarkistetaan, että summa vastaa kaikkien ruokien hintoja
    // Tomaattikeitto 4 + Kalakeitto 6 + Jäätelö 3 + Kahvi 3 = 16
    expect(summa).toBe(16);
  });

  it('laskee oikein vain pääruoan, jos muita ei ole', () => {
    const tilaus = ['Makaroonilaatikko'];
    const summa = ravintola_updated.laskeLasku(tilaus);

    // Makaroonilaatikko 7
    expect(summa).toBe(7);
  });

  it('palauttaa 0 tyhjällä taulukolla', () => {
    const tilaus = [];
    const summa = ravintola_updated.laskeLasku(tilaus);

    expect(summa).toBe(0);
  });

  it('heittää TypeError jos annetaan muu kuin taulukko', () => {
    expect(() => ravintola_updated.laskeLasku('Kalakeitto')).toThrowError(TypeError);
    expect(() => ravintola_updated.laskeLasku(123)).toThrowError(TypeError);
    expect(() => ravintola_updated.laskeLasku(null)).toThrowError(TypeError);
  });
});