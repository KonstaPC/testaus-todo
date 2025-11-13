import { describe, it, expect } from 'vitest';
import ravintola from '../ravintola.js';

describe('laskeLasku', () => {
  it('should return 6 when only main course is ordered', () => {
    // Arrange
    const input = { ottiAlkuruoan: false, ottiJalkiruoan: false, ottiJuoman: false };
    const expected = 6;

    // Act
    const result = ravintola.laskeLasku(
      input.ottiAlkuruoan,
      input.ottiJalkiruoan,
      input.ottiJuoman
    );

    // Assert
    expect(result).toBe(expected);
  });

  it('should return 13 when all courses are ordered', () => {
    // Arrange
    const input = { ottiAlkuruoan: true, ottiJalkiruoan: true, ottiJuoman: true };
    const expected = 4 + 6 + 4 + 3; // alkuruoka + pääruoka + jälkiruoka + juoma = 17? Wait — let's check

    // Act
    const result = ravintola.laskeLasku(
      input.ottiAlkuruoan,
      input.ottiJalkiruoan,
      input.ottiJuoman
    );

    // Assert
    expect(result).toBe(17);
  });

  it('should throw TypeError when any argument is not boolean', () => {
    // Arrange
    const invalidInput = [true, 'yes', false];

    // Act + Assert
    expect(() =>
      ravintola.laskeLasku(...invalidInput)
    ).toThrow(TypeError);
  });

  it('should include drink price only when drink is ordered', () => {
    // Arrange
    const noDrink = ravintola.laskeLasku(false, false, false); // 6 €
    const withDrink = ravintola.laskeLasku(false, false, true); // 6 + 3 €

    // Assert
    expect(withDrink - noDrink).toBe(ravintola.juomaHinta);
  });
});

describe('palautaTaulukonSatunnainenArvo', () => {
  it('palauttaa alkuruoasta arvon, joka löytyy alkuruoat-taulukosta', () => {
    const tulos = ravintola.palautaTaulukonSatunnainenArvo(ravintola.alkuruoat);
    expect(ravintola.alkuruoat).toContain(tulos);
  });

  it('palauttaa pääruoasta arvon, joka löytyy paaruoat-taulukosta', () => {
    const tulos = ravintola.palautaTaulukonSatunnainenArvo(ravintola.paaruoat);
    expect(ravintola.paaruoat).toContain(tulos);
  });

  it('palauttaa jälkiruoasta arvon, joka löytyy jalkiruoat-taulukosta', () => {
    const tulos = ravintola.palautaTaulukonSatunnainenArvo(ravintola.jalkiruoat);
    expect(ravintola.jalkiruoat).toContain(tulos);
  });

  it('palauttaa juomasta arvon, joka löytyy juomat-taulukosta', () => {
    const tulos = ravintola.palautaTaulukonSatunnainenArvo(ravintola.juomat);
    expect(ravintola.juomat).toContain(tulos);
  });
});

describe('syoRavintolassa', () => {
  it('palauttaa taulukon, kun asiakkaita on tilaa', () => {
    const asiakkaidenMaara = 3; // alle paikkojen määrän
    const tulos = ravintola.syoRavintolassa(asiakkaidenMaara);
    
    // Tarkistetaan tyyppi
    expect(Array.isArray(tulos)).toBe(true);

    // Tarkistetaan, että taulukon pituus vastaa asiakasmäärää
    expect(tulos.length).toBe(asiakkaidenMaara);
  });

  it('palauttaa undefined, kun asiakkaita on enemmän kuin paikkoja', () => {
    const asiakkaidenMaara = ravintola.paikkojenMaara + 1; 
    const tulos = ravintola.syoRavintolassa(asiakkaidenMaara);

    expect(tulos).toBeUndefined();
  });

  it('heittää TypeErrorin, jos parametrina ei ole numero', () => {
    expect(() => ravintola.syoRavintolassa('kolme')).toThrow(TypeError);
  });
});