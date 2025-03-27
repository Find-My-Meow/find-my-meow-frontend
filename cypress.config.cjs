const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    // env: {
    //   VITE_BACKEND_URL: "http://localhost:8000",
    // }
  },
});
