describe("Pizza-online -tilauksen testaus", () => {
  it("Tekee tilauksen ja tarkistaa loppusumman", () => {
    // Vieraillaan sivustolla
    cy.visit("https://tiko.jamk.fi/~imjar/fronttiper/esimteht/pizza_anim/");

    // -------------------------
    // 1) Lomakekentät
    // -------------------------

    cy.get('input[name="Nimi"]')
      .type("Matti Meikäläinen")
      .should("have.value", "Matti Meikäläinen");

    cy.get('input[name="Puhelin"]')
      .type("0401234567")
      .should("have.value", "0401234567");

    cy.get('input[name="Sähköposti"]')
      .type("matti@example.com")
      .should("have.value", "matti@example.com");

    // -------------------------
    // 2) Koko valintalistasta
    // -------------------------

    cy.get('select[name="Pizzan koko"]')
      .select("Normaali")
      .should("have.value", "Normaali");

    // -------------------------
    // 3) Pohjan valinta
    // -------------------------

    cy.get('input[name="Pohja"][value="Ruis"]')
      .check()
      .should("be.checked");

    // -------------------------
    // 4) Täytteet
    // -------------------------

    const taytteet = ["kinkku", "ananas", "aurajuusto"];

    taytteet.forEach(t => {
      cy.get(`input[name="täytteet"][value="${t}"]`)
        .check()
        .should("be.checked");
    });

    // -------------------------
    // 5) Loppusumman tarkistus
    // -------------------------

    // Normaali koko = 10 €
    // 3 täytettä → 1 ilmainen + 2 × 0,50 = +1,00 €
    const expectedTotal = "11 €";  // Muoto mukautettu sivun formaattiin

    cy.get("#Hinta")
      .should("be.visible")
      .and("contain", expectedTotal);
  });
});