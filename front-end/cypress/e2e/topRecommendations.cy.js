import { IoTabletLandscape } from "react-icons/io5"

beforeEach( async () => {
    await cy.request('POST', 'http://localhost:5000/reset-database', {})
})

describe('Testa a rota de top', () => {

    it('Deve ir para a rota /random ao clicar no botão random', () => {
        cy.AddRecommendation();
        cy.AddRecommendation();
        cy.visit('http://localhost:3000/');

        cy.get("div").contains("Top").click();

        cy.url().should('include', '/top');


    });
})