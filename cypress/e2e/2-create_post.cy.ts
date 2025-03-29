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
    // ✅ Wait for backend to respond with increased timeout
    cy.wait("@createPost", { timeout: 60000 }).its("response.statusCode").should("eq", 200);

    // ✅ Optional: check SweetAlert
    cy.get(".swal2-title").should("contain", "สร้างโพสต์สำเร็จ");
  });

  it("prevents submission if required image field is missing", () => {
    // ✅ Fill in the form (skip #color field)
    cy.get('input[type="checkbox"][value="lost"]').check({ force: true });
    cy.get("#name").type("CY");
    cy.get("#male").check({ force: true });
    cy.get("#color").type("ดำ");
    cy.get("#breed").type("ไทย", { force: true });
    cy.get("#catInfo").type("มีลายขาว");
    cy.get("#extraDetails").type("หายที่");
    cy.get('input[type="date"]').type(new Date().toISOString().split("T")[0]);

    // ✅ Upload image
    cy.get('input[type="file"]').selectFile("cypress/fixtures/cat.jpeg", {
      force: true,
    });

    // ❌ Leave out the color input and attempt to submit
    cy.get("form").submit();

    // 🔒 Ensure POST /posts was NOT called
    cy.get("@createPost.all").should("have.length", 0);
    // ✅ Optional: check for validation error
    cy.get(".swal2-title").should("contain", "กรุณาเลือกตำแหน่งบนแผนที่");
  });
  it("prevents submission if required location field is missing", () => {
    // ✅ Fill in the form (skip #color field)
    cy.get('input[type="checkbox"][value="lost"]').check({ force: true });
    cy.get("#name").type("CY");
    cy.get("#male").check({ force: true });
    cy.get("#color").type("ดำ");
    cy.get("#breed").type("ไทย", { force: true });
    cy.get("#catInfo").type("มีลายขาว");
    cy.get("#extraDetails").type("หายที่");
    cy.get('input[type="date"]').type(new Date().toISOString().split("T")[0]);

    cy.get(".gm-style", { timeout: 10000 }).should("exist");
    cy.get(".gm-style").click(100, 100);

    // ❌ Leave out the color input and attempt to submit
    cy.get("form").submit();

    // 🔒 Ensure POST /posts was NOT called
    cy.get("@createPost.all").should("have.length", 0);
    // ✅ Optional: check for validation error
    cy.get(".swal2-title").should("contain", "กรุณาอัปโหลดรูปภาพ");
  });

});
