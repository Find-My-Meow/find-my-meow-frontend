describe("Find and Edit Post via Lost Cat List", () => {
  let postId: string | null = null;

  before(() => {
    // ✅ Set login manually
    cy.visit("/auth/login");
    cy.window().then((win) => {
      win.localStorage.setItem("user_id", "test-user-id");
      win.localStorage.setItem(
        "user",
        JSON.stringify({ email: "test@example.com" })
      );
    });
  });

  it("finds CY post and navigates to detail", () => {
    cy.visit("/lost-cat");

    cy.contains("CY", { timeout: 20000 })
      .should("exist")
      .closest("div.rounded-lg")
      .within(() => {
        cy.contains("เพิ่มเติม").click();
      });

    cy.url().should("include", "/cat-detail/");
    cy.url().then((url) => {
      const match = url.match(/\/cat-detail\/(\d+)/);
      if (match && match[1]) {
        postId = match[1];
        cy.log("Found Post ID: ", postId);
      }
      expect(postId).to.exist;
    });
  });

  it("clicks edit from detail and updates the post", function () {
    expect(postId).to.not.be.null;

    // ✅ Simulate login again (if redirect reset it)
    cy.visit("/auth/login");
    cy.window().then((win) => {
      win.localStorage.setItem("user_id", "test-user-id");
      win.localStorage.setItem(
        "user",
        JSON.stringify({ email: "test@example.com" })
      );
    });

    // ✅ Visit the detail page
    cy.visit(`/cat-detail/${postId}`);

    // ✅ Wait for "แก้ไข" button and click it
    cy.contains("button", "แก้ไข", { timeout: 15000 })
      .should("be.visible")
      .click();

    // ✅ Ensure we're on the edit page and input exists
    cy.url().should("include", `/cat-detail/${postId}/edit`);
    cy.get("#color", { timeout: 15000 }).should("exist").clear().type("ดำเข้ม");

    // ✅ Submit
    cy.get("form").submit();

    // ✅ Confirm success
    cy.get(".swal2-title", { timeout: 10000 }).should(
      "contain",
      "อัปเดตโพสต์เรียบร้อยแล้ว"
    );
  });
});
