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
  
  
  describe("Create New Post (mocked quality)", () => {
    beforeEach(() => {
      // ✅ Simulate login
      cy.visit("/auth/login");
      cy.window().then((win) => {
        win.localStorage.setItem("user_id", "test-user-id");
        win.localStorage.setItem(
          "user",
          JSON.stringify({ email: "test@example.com" })
        );
      });
  
      // ✅ Mock image quality API
      cy.intercept("POST", "**/api/v1/image/check-quality", {
        statusCode: 200,
        body: { issues: [] },
      }).as("mockImageQuality");
  
      // ✅ Intercept posts (don't hardcode full URL to avoid mismatch)
      cy.intercept("POST", "**/api/v1/posts/").as("createPost"); // trailing slash ✅
  
      cy.visit("/create-newpost");
    });
  
    it("successfully creates a new post", () => {
      // Fill in form
      cy.get('input[type="checkbox"][value="lost"]').check({ force: true });
      cy.get("#name").type("CY");
      cy.get("#male").check({ force: true });
      cy.get("#color").type("ดำ");
      cy.get("#breed").type("ไทย", { force: true });
      cy.get("#catInfo").type("มีลายขาว");
      cy.get("#extraDetails").type("หายที่");
      cy.get('input[type="date"]').type(new Date().toISOString().split("T")[0]);
  
      cy.get('input[type="file"]').selectFile("cypress/fixtures/cat.jpeg", {
        force: true,
      });
  
      cy.get("#email").check({ force: true });
  
      // Wait for map to load and click it
      cy.get(".gm-style", { timeout: 10000 }).should("exist");
      cy.get(".gm-style").click(100, 100);
  
      cy.wait(500); // short buffer for state to settle
  
      // ✅ Submit form
      cy.get("form").submit();
  
      // ✅ Wait for backend to respond
      cy.wait("@createPost").its("response.statusCode").should("eq", 200);
  
      // ✅ Optional: check SweetAlert
      cy.get(".swal2-title").should("contain", "สร้างโพสต์สำเร็จ");
    });
  });
  
//   describe("Delete Post", () => {
//     beforeEach(() => {
//       // Simulate login
//       cy.visit("/auth/login");
//       cy.window().then((win) => {
//         win.localStorage.setItem("user_id", "test-user-id");
//         win.localStorage.setItem(
//           "user",
//           JSON.stringify({ email: "test@example.com" })
//         );
//       });
  
//       // Intercept delete post API
//       cy.intercept("DELETE", "**/api/v1/posts/*").as("deletePost");
  
//       // Visit post detail page
//       cy.visit("/cat-detail/28");
//     });
  

//     it("deletes a post successfully", () => {
//       // ✅ Wait for the delete button to appear before clicking
//       cy.contains("button", "ลบ", { timeout: 20000 }).should("be.visible").click();
  
//       // ✅ Wait for SweetAlert modal to appear
//       cy.get(".swal2-confirm", { timeout: 10000 }).should("be.visible").click();
  
//       // ✅ Wait for DELETE request to finish
//       cy.wait("@deletePost").its("response.statusCode").should("eq", 200);
  
//       // ✅ Confirm success message appears
//       cy.get(".swal2-title", { timeout: 10000 }).should("contain", "ลบโพสต์สำเร็จ");
//     });
//   });
//   describe("Find and Delete Post via Lost Cat List", () => {
//     let postId: string | null = null;
  
    // before(() => {
    //   // Simulate login
    //   cy.visit("/auth/login");
    //   cy.window().then((win) => {
    //     win.localStorage.setItem("user_id", "test-user-id");
    //     win.localStorage.setItem(
    //       "user",
    //       JSON.stringify({ email: "test@example.com" })
    //     );
    //   });
    // });
  
    // it("finds CY post and navigates to detail", () => {
    //   cy.visit("/lost-cat");
  
    //   // Wait up to 20s for "CY" to render
    //   cy.contains("CY", { timeout: 20000 })
    //     .should("exist")
    //     .parentsUntil("div.rounded-lg")
    //     .parent()
    //     .within(() => {
    //       cy.contains("เพิ่มเติม").click();
    //     });
  
    //   // Extract post ID from URL
    //   cy.url().should("include", "/cat-detail/");
    //   cy.url().then((url) => {
    //     const match = url.match(/\/cat-detail\/(.+)/);
    //     if (match && match[1]) {
    //       postId = match[1];
    //     }
    //     expect(postId).to.exist;
    //   });
    // });
  
//     it("deletes the post", () => {
//     //   expect(postId).to.not.be.null;
  
//       cy.intercept("DELETE", "**/api/v1/posts/*").as("deletePost");
  
//       // Visit the post detail page again just to be sure
//       cy.visit(`/cat-detail/27`);
  
//       // Wait for delete button and click
//       cy.contains("button", "ลบ", { timeout: 20000 }).should("be.visible").click();
  
//       // Confirm SweetAlert
//       cy.get(".swal2-confirm", { timeout: 10000 }).should("be.visible").click();
  
//       // Wait for DELETE request
//       cy.wait("@deletePost").its("response.statusCode").should("eq", 200);
  
//       // Confirm success alert
//       cy.get(".swal2-title", { timeout: 10000 }).should("contain", "ลบโพสต์สำเร็จ");
//     });
//   });
  

// describe("Create, Edit, and Delete Post", () => {
//     let createdPostId: string | null = null;
  
//     before(() => {
//       // Simulate login
//       cy.visit("/auth/login");
//       cy.window().then((win) => {
//         win.localStorage.setItem("user_id", "test-user-id");
//         win.localStorage.setItem(
//           "user",
//           JSON.stringify({ email: "test@example.com" })
//         );
//       });
//     });
  
//     it("creates a new post", () => {
//       cy.intercept("POST", "**/api/v1/image/check-quality", {
//         statusCode: 200,
//         body: { issues: [] },
//       }).as("mockImageQuality");
  
//       cy.intercept("POST", "**/api/v1/posts").as("createPost");
  
//       cy.visit("/create-newpost");
  
//       cy.get('input[type="checkbox"][value="lost"]').check({ force: true });
//       cy.get("#name").type("CY");
//       cy.get("#male").check({ force: true });
//       cy.get("#color").type("ดำ");
//       cy.get("#breed").type("ไทย");
//       cy.get("#catInfo").type("มีลายขาว");
//       cy.get("#extraDetails").type("หายที่");
//       cy.get('input[type="date"]').type(new Date().toISOString().split("T")[0]);
  
//       cy.get('input[type="file"]').selectFile("cypress/fixtures/cat.jpeg", {
//         force: true,
//       });
  
//       cy.get("#email").check({ force: true });
  
//       cy.get(".gm-style", { timeout: 10000 }).should("exist");
//       cy.get(".gm-style").click(100, 100);
//       cy.wait(500);
  
//       cy.get("form").submit();
  
//       cy.wait("@createPost").then(({ response }) => {
//         expect(response?.statusCode).to.eq(200);
//         createdPostId = response?.body?.post_id;
//         expect(createdPostId).to.exist;
//       });
  
//       cy.get(".swal2-title").should("contain", "สร้างโพสต์สำเร็จ");
//     });
  
//     // it("edits the created post", () => {
//     //   expect(createdPostId).to.not.be.null;
//     //   cy.visit(`/cat-detail/${createdPostId}/edit`);
//     //   cy.get("#color").clear().type("ดำเข้ม");
//     //   cy.get("form").submit();
  
//     //   cy.get(".swal2-title").should("contain", "อัปเดตโพสต์เรียบร้อยแล้ว");
//     // });
  
//     // it("deletes the created post", () => {
//     //   cy.intercept("DELETE", "**/api/v1/posts/*").as("deletePost");
  
//     //   expect(createdPostId).to.not.be.null;
//     //   cy.visit(`/cat-detail/${createdPostId}`);
//     //   cy.contains("button", "ลบ").click();
//     //   cy.get(".swal2-confirm").click();
  
//     //   cy.wait("@deletePost").its("response.statusCode").should("eq", 200);
//     //   cy.get(".swal2-title").should("contain", "ลบโพสต์สำเร็จ");
//     // });
//   });
  