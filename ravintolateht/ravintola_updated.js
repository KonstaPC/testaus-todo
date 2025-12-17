/*
TIKO RAVINTOLA päivitetty
OHJELMAKOODI
*/

const Ravintola = function () {
  this.alkuruoat = [
    { nimi: 'Tomaattikeitto', hinta: 4 },
    { nimi: 'Leipä', hinta: 2 },
    { nimi: 'Vihersalaatti', hinta: 3 },
    { nimi: 'Salsa', hinta: 3 }
  ];

  this.paaruoat = [
    { nimi: 'Kalakeitto', hinta: 6 },
    { nimi: 'Makaroonilaatikko', hinta: 7 },
    { nimi: 'Kasvispihvi', hinta: 6 },
    { nimi: 'Kanasalaatti', hinta: 8 }
  ];

  this.jalkiruoat = [
    { nimi: 'Hedelmäsalaatti', hinta: 4 },
    { nimi: 'Jäätelö', hinta: 3 },
    { nimi: 'Pulla', hinta: 3 },
    { nimi: 'Donitsi', hinta: 4 }
  ];

  this.juomat = [
    { nimi: 'Tee', hinta: 2 },
    { nimi: 'Kahvi', hinta: 3 },
    { nimi: 'Maito', hinta: 2 },
    { nimi: 'Mehu', hinta: 3 }
  ];

  this.paikkojenMaara = 15;
  this.paikat; // Taulukko varattuja/vapaita paikkoja
};

/**
 * Palauttaa satunnaisen boolean arvon
 * @return {boolean} Randomized boolean
 */
function generoiBoolean() {
  return Math.random() < 0.5;
}

/**
 * Palauttaa satunnaisen arvon annetusta taulukosta
 * @param {Array} taulukko
 * @return {Object} satunnainen elementti
 */
Ravintola.prototype.palautaTaulukonSatunnainenArvo = function (taulukko) {
  return taulukko[Math.floor(Math.random() * taulukko.length)];
};

/**
 * Luo paikat-muuttujaan taulukon ja täyttää sen false-arvoilla
 */
Ravintola.prototype.generoiPaikat = function () {
  this.paikat = new Array(this.paikkojenMaara).fill(false);
};

/**
 * Varaa paikkoja ravintolasta
 * @param {number} varauksenMaara - montako paikkaa halutaan varata (oletus 1)
 * @return {boolean} true jos varaus onnistui, false jos ei riittävästi vapaita paikkoja
 */
Ravintola.prototype.varaaPaikat = function (varauksenMaara = 1) {
  if (!Array.isArray(this.paikat)) {
    this.generoiPaikat();
  }

  const vapaat = this.paikat.filter(p => !p).length;

  if (vapaat < varauksenMaara) return false;

  let varattu = 0;
  for (let i = 0; i < this.paikat.length && varattu < varauksenMaara; i++) {
    if (!this.paikat[i]) {
      this.paikat[i] = true;
      varattu++;
    }
  }

  return true;
};

/**
 * Tarkistaa, että 'asiakkaidenMaara' on suurempi kuin 0, mutta pienempi tai yhtäsuuri kuin 'paikkojenMaara'.
 * Heittää TypeError jos ei numero.
 * @param {number} asiakkaidenMaara
 * @return {boolean} Onnistuminen
 */
Ravintola.prototype.tarkistaPaikkojenMaara = function (asiakkaidenMaara) {
  if (typeof asiakkaidenMaara !== 'number') throw new TypeError();

  if (asiakkaidenMaara <= 0) {
    console.log('Ikävä kyllä emme voi tarjoilla ' + asiakkaidenMaara + ' asiakkaalle.');
    return false;
  } else if (asiakkaidenMaara <= this.paikkojenMaara) {
    console.log('Tilaa on ' + asiakkaidenMaara + ' asiakkaalle. Tervetuloa ravintolaamme!');
    return true;
  } else {
    console.log('Ikävä kyllä ravintolaamme ei mahdu ' + asiakkaidenMaara + ' asiakasta.');
    return false;
  }
};

/**
 * Palvelu: tarjoilee asiakkaille ruokaa ja varaa paikat
 * @param {number} asiakkaidenMaara
 * @return {Array|undefined} tilaukset
 */
Ravintola.prototype.syoRavintolassa = function (asiakkaidenMaara) {
  if (!this.tarkistaPaikkojenMaara(asiakkaidenMaara)) return;

  if (!this.varaaPaikat(asiakkaidenMaara)) {
    console.log('Ei tarpeeksi vapaita paikkoja.');
    return;
  }

  const tilaukset = [];
  for (let i = 0; i < asiakkaidenMaara; i++) {
    console.log('-------------------------------------------------------');
    console.log('Tarjoillaan asiakasta numero ' + (i + 1) + '. Mitä teille saisi olla?');
    tilaukset.push(this.tilaaAteria(generoiBoolean(), generoiBoolean(), generoiBoolean()));
    console.log('Asiakkaalle tarjoiltu. Hyvää ruokahalua!');
  }
  console.log('-------------------------------------------------------');
  console.log('Kaikille asiakkaille tarjoiltu!');
  return tilaukset;
};

/**
 * Tilaa ateria satunnaisesti valittuna
 * @param {boolean} ottaaAlkuruoan
 * @param {boolean} ottaaJalkiruoan
 * @param {boolean} ottaaJuoman
 * @return {Object} { summa, ruoat }
 */
Ravintola.prototype.tilaaAteria = function (ottaaAlkuruoan, ottaaJalkiruoan, ottaaJuoman) {
  if (typeof ottaaAlkuruoan !== 'boolean' || typeof ottaaJalkiruoan !== 'boolean' || typeof ottaaJuoman !== 'boolean') {
    throw new TypeError();
  }

  const ruoat = [];
  let ruoka;

  if (ottaaAlkuruoan) {
    ruoka = this.palautaTaulukonSatunnainenArvo(this.alkuruoat);
    ruoat.push(ruoka.nimi);
  }

  ruoka = this.palautaTaulukonSatunnainenArvo(this.paaruoat);
  ruoat.push(ruoka.nimi);

  if (ottaaJalkiruoan) {
    ruoka = this.palautaTaulukonSatunnainenArvo(this.jalkiruoat);
    ruoat.push(ruoka.nimi);
  }

  if (ottaaJuoman) {
    ruoka = this.palautaTaulukonSatunnainenArvo(this.juomat);
    ruoat.push(ruoka.nimi);
  }

  const summa = this.laskeLasku(ruoat);

  return { summa, ruoat };
};

/**
 * Laskee tilauksen summan ruoat-taulukon perusteella
 * @param {Array} ruoat - taulukko nimistä
 * @return {number} loppuSumma
 */
Ravintola.prototype.laskeLasku = function (ruoat) {
  if (!Array.isArray(ruoat)) throw new TypeError();

  let loppuSumma = 0;
  const kaikkiRuoat = [...this.alkuruoat, ...this.paaruoat, ...this.jalkiruoat, ...this.juomat];

  for (const nimi of ruoat) {
    const ruoka = kaikkiRuoat.find(r => r.nimi === nimi);
    if (ruoka) loppuSumma += ruoka.hinta;
  }

  return loppuSumma;
};

const ravintola = new Ravintola();

export default ravintola;
