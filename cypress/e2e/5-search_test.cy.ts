describe("SearchPage", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/api/v1/search/search").as("searchCat");
  });
  
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
    cy.wait("@searchCat", { timeout: 60000 }).its("response.statusCode").should("eq", 200);

    cy.location("pathname", { timeout: 10000 }).should("eq", "/result");
  });
  it("search cat photo", () => {
    cy.visit("/search-cat");

    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-cat.webp", {
      force: true,
    });
    cy.get("img[alt='Selected']").should("be.visible");

    cy.wait(500);

    cy.get("button[type='submit']").click({ force: true });
    cy.wait("@searchCat", { timeout: 60000 }).its("response.statusCode").should("eq", 200);

    cy.location("pathname", { timeout: 10000 }).should("eq", "/result");
  });
  it("search cat location", () => {
    cy.visit("/search-cat");

    cy.get(".gm-style", { timeout: 10000 }).should("exist");
    cy.get(".gm-style").click(100, 100);

    cy.contains("พิกัด").should("exist");
    cy.get('input[type="number"][placeholder="ระบุระยะทาง"]').clear().type("21");

    cy.wait(500);

    cy.get("button[type='submit']").click({ force: true });
    cy.wait("@searchCat", { timeout: 60000 }).its("response.statusCode").should("eq", 200);

    cy.location("pathname", { timeout: 10000 }).should("eq", "/result");
  });
  it("search no photo and location", () => {
    cy.visit("/search-cat");
    cy.get("button[type='submit']").click({ force: true });
    cy.get(".swal2-title", { timeout: 10000 }).should(
      "contain",
      "กรุณาใส่ข้อมูล"
    );
  });
  it("search with not cat photo", () => {
    cy.visit("/search-cat");

    cy.get('input[type="file"]').selectFile("cypress/fixtures/dog.jpg", {
      force: true,
    });
    cy.get("img[alt='Selected']").should("be.visible");

    cy.get(".gm-style", { timeout: 10000 }).should("exist");
    cy.get(".gm-style").click(100, 100);

    cy.contains("พิกัด").should("exist");
    cy.get('input[type="number"][placeholder="ระบุระยะทาง"]').clear().type("21");

    cy.wait(500);

    cy.get("button[type='submit']").click({ force: true });
    cy.wait("@searchCat", { timeout: 60000 }).its("response.statusCode").should("eq", 400);

    cy.location("pathname", { timeout: 10000 }).should("eq", "/result");
    cy.contains("ไม่พบแมวในรูปภาพ").should("exist");

  });
});