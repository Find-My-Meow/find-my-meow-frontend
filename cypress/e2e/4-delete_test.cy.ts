describe("Find and Delete Post via Lost Cat List", () => {
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
  
    it("deletes the post using extracted ID", () => {
      expect(postId).to.not.be.null;
  
      // ✅ Simulate login again in case redirect cleared it
      cy.visit("/auth/login");
      cy.window().then((win) => {
        win.localStorage.setItem("user_id", "test-user-id");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ email: "test@example.com" })
        );
      });
  
      cy.intercept("DELETE", "**/api/v1/posts/*").as("deletePost");
  
      cy.visit(`/cat-detail/${postId}`);
  
      cy.contains("button", "ลบ", { timeout: 20000 }).should("be.visible").click();
      cy.get(".swal2-confirm", { timeout: 10000 }).should("be.visible").click();
      cy.wait("@deletePost").its("response.statusCode").should("eq", 200);
      cy.get(".swal2-title", { timeout: 10000 }).should("contain", "ลบโพสต์สำเร็จ");
    });
  });
  