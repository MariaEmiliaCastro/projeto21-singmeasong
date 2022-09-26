beforeEach( async () => {
    await cy.request('POST', 'http://localhost:5000/reset-database', {})
})

describe('Testa a rota de top', () => {

    it('Deve ir para a rota /random ao clicar no botão random', () => {
        cy.AddRecommendation();
        cy.AddRecommendation();
        cy.visit('http://localhost:3000/');

        cy.get("div").contains("Random").click();

        cy.url().should('include', '/random');
    });

    it('Deve haver uma recomendação na tela', () => {
        cy.AddRecommendation();
        cy.AddRecommendation();
        cy.AddRecommendation();
        cy.AddRecommendation();
        
        cy.visit('http://localhost:3000/random');
        cy.get('[data-cy="upvote-arrow"]').click();
    });
})