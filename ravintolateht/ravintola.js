/*
TIKO RAVINTOLA
OHJELMAKOODI
*/

const Ravintola = function () {
  this.alkuruoat = ['Tomaattikeitto', 'Leipä', 'Vihersalaatti', 'Salsa'];
  this.paaruoat = [
    'Kalakeitto',
    'Makaroonilaatikko',
    'Kasvispihvi',
    'Kanasalaatti',
  ];
  this.jalkiruoat = ['Hedelmäsalaatti', 'Jäätelö', 'Pulla', 'Donitsi'];
  this.juomat = ['Tee', 'Kahvi', 'Maito', 'Mehu'];
  this.alkuruokaHinta = 4;
  this.paaruokaHinta = 6;
  this.jalkiruokaHinta = 4;
  this.juomaHinta = 3;
  this.paikkojenMaara = 15;
};

/**
 * Palauttaa satunnaisen boolean arvon
 * @return {boolean} Randomized boolean
 */
function generoiBoolean() {
  return Math.random() < 0.5;
}

/**
 * Jos 'asiakkaidenMaara' on pienempi tai yhtäsuuri kuin 'paikkojenMaara', luo taulukon 'tilaukset'
 * johon tallennetaan yksittäisen asiakkaan tilaus. tilaaAteria-funktiolle annetaan satunnaiset boolean arvot
 * argumentteina.
 *
 * Palauttaa päätteeksi 'tilaukset' taulukon.
 * @param {number} asiakkaidenMaara
 * @return {object} object array
 */
Ravintola.prototype.syoRavintolassa = function (asiakkaidenMaara) {
  const onTilaa = this.tarkistaPaikkojenMaara(asiakkaidenMaara);
  if (!onTilaa) {
    return;
  }
  const tilaukset = [];

  for (let i = 0; i < asiakkaidenMaara; i++) {
    console.log('-------------------------------------------------------');
    console.log(
      'Tarjoillaan asiakasta numero ' + (i + 1) + '. Mitä teille saisi olla?'
    );
    tilaukset.push(
      this.tilaaAteria(generoiBoolean(), generoiBoolean(), generoiBoolean())
    );
    console.log('Asiakkaalle tarjoiltu. Hyvää ruokahalua!');
  }
  console.log('-------------------------------------------------------');
  console.log('Kaikille asiakkaille tarjoiltu!');

  return tilaukset;
};

/**
 * Tarkistaa, että 'asiakkaidenMaara' on suurempi kuin 0, mutta pienempi tai yhtäsuuri kuin 'paikkojenMaara'.
 *
 * Kirjoittaa konsoliin tulosteen tilanteesta, ja palauttaa onnistumisen boolean arvona.
 *
 * Jos 'asiakkaidenMaara' ei ole numero, heittää TypeErrorin.
 * @param {number} asiakkaidenMaara
 * @return {boolean} Onnistuminen
 */
Ravintola.prototype.tarkistaPaikkojenMaara = function (asiakkaidenMaara) {
  if (typeof asiakkaidenMaara !== 'number') {
    throw new TypeError();
  }
  if (asiakkaidenMaara <= 0) {
    console.log(
      'Ikävä kyllä emme voi tarjoilla ' + asiakkaidenMaara + ' asiakkaalle.'
    );
    return false;
  } else if (asiakkaidenMaara <= this.paikkojenMaara) {
    console.log(
      'Tilaa on ' + asiakkaidenMaara + ' asiakkaalle. Tervetuloa ravintolaamme!'
    );
    return true;
  } else {
    console.log(
      'Ikävä kyllä ravintolaamme ei mahdu ' + asiakkaidenMaara + ' asiakasta.'
    );
    return false;
  }
};

/**
 * Ottaa parametreina 3 boolean arvoa, joiden avulla määritellään mitä ruokia asiakas tilaa.
 * Jos parametrit eivät ole tyyppiä boolean, heitetään TypeError.
 *
 * Tilaukset tallennetaan 'ruoat' taulukkoon boolean parametrien mukaisesti.
 *
 * Lopuksi kutsutaan 'laskeLasku' funktiota, jolla lasketaan tilauksen lasku.
 *
 * Palauttaa objektin, joka sisältää numeron ja string-taulukon
 *
 * @param {boolean} ottaaAlkuruoan
 * @param {boolean} ottaaJalkiruoan
 * @param {boolean} ottaaJuoman
 * @return {object} object - number, string[]
 */
Ravintola.prototype.tilaaAteria = function (
  ottaaAlkuruoan,
  ottaaJalkiruoan,
  ottaaJuoman
) {
  if (
    typeof ottaaAlkuruoan !== 'boolean' ||
    typeof ottaaJalkiruoan !== 'boolean' ||
    typeof ottaaJuoman !== 'boolean'
  ) {
    throw new TypeError();
  }

  const ruoat = [];
  let ruoka;

  if (ottaaAlkuruoan) {
    ruoka = this.palautaTaulukonSatunnainenArvo(this.alkuruoat);
    console.log('Ottaisin alkuruoaksi: ' + ruoka);
    ruoat.push(ruoka);
  }

  ruoka = this.palautaTaulukonSatunnainenArvo(this.paaruoat);
  console.log('Ottaisin pääruoaksi: ' + ruoka);
  ruoat.push(ruoka);

  if (ottaaJalkiruoan) {
    ruoka = this.palautaTaulukonSatunnainenArvo(this.jalkiruoat);
    console.log('Ottaisin jälkiruoaksi: ' + ruoka);
    ruoat.push(ruoka);
  }

  if (ottaaJuoman) {
    ruoka = this.palautaTaulukonSatunnainenArvo(this.juomat);
    console.log('Ottaisin juomaksi: ' + ruoka);
    ruoat.push(ruoka);
  }

  const summa = this.laskeLasku(ottaaAlkuruoan, ottaaJalkiruoan, ottaaJuoman);

  return { summa, ruoat };
};

/**
 * Palauttaa satunnaisen arvon annetusta taulukosta
 * @param {string[]} taulukko
 * @return {string}
 */
Ravintola.prototype.palautaTaulukonSatunnainenArvo = function (taulukko) {
  return taulukko[Math.floor(Math.random() * taulukko.length)];
};

/**
 * Laskee summan annettujen boolean parametrien mukaisesti.
 * Jos parametrit eivät ole tyyppiä boolean, heittää TypeErrorin.
 *
 * 'loppuSumma' muuttujaan lisätään automaattisesti 'paaruokaHinta', ja loput hinnat sitten parametrien mukaisesti.
 *
 * Palauttaa lopussa 'loppuSumma'.
 *
 * @param {boolean} ottiAlkuruoan
 * @param {boolean} ottiJalkiruoan
 * @param {boolean} ottiJuoman
 * @return {number}
 */
Ravintola.prototype.laskeLasku = function (
  ottiAlkuruoan,
  ottiJalkiruoan,
  ottiJuoman
) {
  if (
    typeof ottiAlkuruoan !== 'boolean' ||
    typeof ottiJalkiruoan !== 'boolean' ||
    typeof ottiJuoman !== 'boolean'
  ) {
    throw new TypeError();
  }

  let loppuSumma = 0;

  loppuSumma += this.paaruokaHinta;

  if (ottiAlkuruoan) {
    loppuSumma += this.alkuruokaHinta;
  }

  if (ottiJalkiruoan) {
    loppuSumma += this.jalkiruokaHinta;
  }

  if (ottiJuoman) {
    loppuSumma += this.juomaHinta;
  }

  return loppuSumma;
};

const ravintola = new Ravintola();

export default ravintola;
