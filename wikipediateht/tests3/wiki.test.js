describe('Jamk Wikipedia flow', () => {
  it('Searches Jamk on Finnish Wikipedia and switches to English (robust)', () => {

    // Käytä desktop-viewportia, jotta sivu latautuu desktop-versiona
    cy.viewport(1280, 900);

    // 1. Mene suomenkieliseen Wikipediaan
    cy.visit('https://fi.wikipedia.org');

    // 2. Hae Jamk (pakotettuna koska input voi olla piilotettu)
    cy.get('#searchInput', { timeout: 10000 }).type('Jamk{enter}', { force: true });

    // 3. Varmista, että ollaan JAMK-sivulla (anna enemmän timeoutia tarvittaessa)
    cy.url({ timeout: 10000 }).should('include', 'Jyv%C3%A4skyl%C3%A4n_ammattikorkeakoulu');

    // 4. Rullaa "Kampukset"-otsikkoon ja varmistus
    cy.contains('h2', 'Kampukset', { timeout: 10000 }).scrollIntoView().should('be.visible');

    // pieni lyhyt odotus, jotta sivun dynaamiset osat ehtivät latautua
    cy.wait(1000);

    // 5. ETSI englanninkielinen kielilinkki turvallisesti ja siirry sen href:iin
    // Etsitään ensin yleisintä selectoria: interlanguage-link-target + hreflang="en"
    cy.get('a.interlanguage-link-target[hreflang="en"]', { timeout: 8000 })
      .then($els => {
        if ($els.length) {
          // otetaan ensimmäinen löytyvä linkki ja käydään siinä
          const href = $els.first().prop('href');
          cy.log('Found interlanguage link (hreflang=en): ' + href);
          cy.visit(href);
        } else {
          // fallback: etsitään muita mahdollisia englannin linkkejä
          cy.get('a[lang="en"], a[hreflang="en"], a:contains("English")', { timeout: 8000 })
            .then($alt => {
              if ($alt.length) {
                const href = $alt.first().prop('href');
                cy.log('Found fallback English link: ' + href);
                cy.visit(href);
              } else {
                // jos ei löydy ollenkaan, heitetään selkeä virheilmoitus testiin
                throw new Error('English language link not found on page');
              }
            });
        }
      });

    // 6. Tarkista englanninkielisen sivun URL (anna timeout koska visit voi olla hidas)
    cy.url({ timeout: 10000 }).should('include', 'JAMK_University_of_Applied_Sciences');
  });
});