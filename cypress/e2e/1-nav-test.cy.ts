describe("Navigation routes", () => {
    it("Visits the homepage", () => {
      cy.visit("/");
      cy.contains("ประกาศ").should("exist");
    });
  
    it("Visits the lost cat page", () => {
      cy.visit("/lost-cat");
      cy.contains("ประกาศตามหาแมวหาย").should("exist");
    });
  
    it("Visits the found cat page", () => {
      cy.visit("/found-cat");
      cy.contains("ประกาศตามหาเจ้าของแมว").should("exist");
    });
  
    it("Visits the adopt cat page", () => {
      cy.visit("/adopt-cat");
      cy.contains("ประกาศหาบ้านให้แมว").should("exist");
    });
  });
  
  it("Visits the user profile page", () => {
    cy.visit("/auth/login");
    cy.window().then((win) => {
      win.localStorage.setItem("user_id", "test-user-id");
      win.localStorage.setItem(
        "user",
        JSON.stringify({ email: "test@example.com", name: "Test User" })
      );
    });
  
    // ✅ Go to profile *after* login setup
    cy.visit("/user-profile");
  
    // ✅ Wait for the text to appear
    cy.contains("ข้อมูลผู้ใช้งาน", { timeout: 10000 }).should("exist");
  });