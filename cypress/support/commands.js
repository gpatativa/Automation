// ***********************************************
// Custom Commands – Blog Agibank
// ***********************************************

/**
 * Abre o campo de busca clicando no ícone de lupa no header.
 * Reutilizado em todos os cenários que precisam interagir com a pesquisa.
 */
Cypress.Commands.add("abrirCampoDeBusca", () => {
  cy.get('[data-section="section-header-search"] a[role="button"]')
    .first()
    .click();
});