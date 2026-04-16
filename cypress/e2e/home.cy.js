// ============================================================
// Cenários de teste: Blog Agibank – Pesquisa de Artigos
// URL base: https://blog.agibank.com.br/institucional/
// ============================================================

/**
 * Mapa de seletores centralizado para facilitar manutenção.
 * Quando um seletor mudar no DOM, só precisa ser atualizado aqui.
 */
const selectors = {
  searchToggleButton: '[data-section="section-header-search"] a[role="button"]',
  searchInput:        'input[name="s"][placeholder="Digite sua busca"]',
  searchField:        'input.search-field[name="s"]',
  searchSubmitButton: 'button#search_submit',
  simulateButton:     'a[role="button"]',
  liveSearchResults:  'div.ast-live-search-results[role="listbox"][aria-label="Search results"]',
  searchResultItem:   'a.ast-search-item[role="option"]',
  searchResultText:   'a.ast-search-item span',
  articleTitle:       'h1.entry-title[itemprop="headline"]',
  noResultsLabel:     'label.ast-search--no-results-heading',
  searchResultsTitle: 'h1.page-title.ast-archive-title',
  noResultsMessage:   '.no-results .page-content p',
};

describe('Blog Agibank – Pesquisa de Artigos', () => {

  // Garante que cada teste começa na página institucional (baseUrl)
  beforeEach(() => {
    cy.visit('/');
  });

  // ------------------------------------------------------------------
  // CT01 – Abrir campo de busca
  // ------------------------------------------------------------------
  context('CT01 – Abrir campo de busca', () => {

    it('deve exibir o campo de busca, o botão de pesquisa e o link de simulação ao clicar na lupa', () => {
      // Ação: abrir o campo via comando customizado
      cy.abrirCampoDeBusca();

      // Validação 1: placeholder do campo de busca visível
      cy.get(selectors.searchInput)
        .should('be.visible');

      // Validação 2: botão de submissão da pesquisa visível
      cy.get(selectors.searchSubmitButton)
        .should('be.visible');

      // Validação 3: link "Simular empréstimo" visível no header
      cy.contains(selectors.simulateButton, 'Simular empréstimo')
        .should('be.visible');
    });

  });

  // ------------------------------------------------------------------
  // CT02 – Realizar pesquisa com sucesso
  // ------------------------------------------------------------------
  context('CT02 – Realizar pesquisa com sucesso', () => {

    it('deve retornar resultados sobre "Pix" e redirecionar ao primeiro resultado', () => {
      // Passo 1: abrir o campo de busca
      cy.abrirCampoDeBusca();

      // Passo 2: validar exibição do campo de busca
      cy.get(selectors.searchInput)
        .should('be.visible');

      // Passo 3: digitar o termo de pesquisa
      cy.get(selectors.searchField)
        .should('be.visible')
        .clear()
        .type('Pix');

      // Passo 4: validar lista de resultados
      cy.get(selectors.liveSearchResults)
        .should('be.visible')
        .within(() => {
          // 4a) Lista não está vazia
          cy.get(selectors.searchResultItem)
            .should('have.length.greaterThan', 0);

          // 4b) Pelo menos um resultado contém "Pix" (case-insensitive)
          cy.contains(selectors.searchResultText, /pix/i)
            .should('exist');
        });

      // Passo 5: clicar no primeiro resultado da lista
      cy.get(`${selectors.liveSearchResults} ${selectors.searchResultItem}`)
        .first()
        .should('be.visible')
        .click();

      // Validação 6: usuário redirecionado para a página correta
      cy.location('origin').should('eq', 'https://blog.agibank.com.br');
      cy.location('pathname').should('eq', '/pix-automatico/');

      // Validação 7: título do artigo visível e correto
      cy.get(selectors.articleTitle)
        .should('be.visible')
        .and('contain', 'Pix automático: o que é e como utilizar');
    });

  });

  // ------------------------------------------------------------------
  // CT03 – Pesquisa sem resultados
  // ------------------------------------------------------------------
  context('CT03 – Pesquisa com termo inválido', () => {

    it('deve exibir mensagem de sem resultados no live search e na página de resultados', () => {
      const termoBusca = 'Pesquisa Invalida';

      // Passo 1: abrir o campo de busca
      cy.abrirCampoDeBusca();

      // Passo 2: validar exibição do campo de busca
      cy.get(selectors.searchInput)
        .should('be.visible');

      // Passo 3: digitar termo que não retorna resultados
      cy.get(selectors.searchField)
        .should('be.visible')
        .clear()
        .type(termoBusca);

      // Passo 4: validar exibição do label "No results found" no live search
      cy.get(selectors.noResultsLabel)
        .should('be.visible')
        .and('contain', 'No results found');

      // Passo 5: submeter a pesquisa clicando no botão de busca
      cy.get(selectors.searchSubmitButton)
        .click();

      // Passo 6: validar redirecionamento para a página de resultados
      cy.location('origin').should('eq', 'https://blog.agibank.com.br');
      cy.location('pathname').should('eq', '/');


      // Passo 7: validar título da página de resultados contendo o termo buscado
      cy.get(selectors.searchResultsTitle)
        .should('be.visible')
        .and('contain', 'Resultados encontrados para:')
        .find('span')
        .should('contain', termoBusca);

      // Passo 8: validar mensagem de nenhum resultado encontrado
      cy.get(selectors.noResultsMessage)
        .should('be.visible')
        .and('contain', 'Lamentamos, mas nada foi encontrado para sua pesquisa, tente novamente com outras palavras.');
    });

  });

});
