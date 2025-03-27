describe("SearchPage", () => {
    it("search cat photo and location", () => {
      cy.visit("/search-cat");
  
      cy.get('input[type="file"]').selectFile("cypress/fixtures/test-cat.webp", {
        force: true,
      });
      cy.get("img[alt='Selected']").should("be.visible");
  
      cy.get(".gm-style", { timeout: 10000 }).should("exist");
      cy.get(".gm-style").click(100, 100);
  
      cy.contains("พิกัด").should("exist");
      cy.get('input[type="number"][placeholder="ระบุระยะทาง"]').clear().type("21");
  
      cy.wait(500);
  
      cy.get("button[type='submit']").click({ force: true });
      cy.location("pathname", { timeout: 10000 }).should("eq", "/result");
    });
  });