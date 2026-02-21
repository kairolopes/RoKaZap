describe("RoKa Zap PWA", () => {
  it("carrega layout de chat", () => {
    cy.visit("/");
    cy.contains("RoKa Zap").should("exist");
  });
});

