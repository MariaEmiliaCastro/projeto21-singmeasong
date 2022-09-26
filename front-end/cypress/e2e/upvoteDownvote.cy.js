import { faker } from '@faker-js/faker';

beforeEach( async () => {
  await cy.request('POST', 'http://localhost:5000/reset-database', {})
})


describe('Testa as funcionalidades de upvote e downvote', () => {

    it('O valor de um upvote deve ser atualizado', () => {
        cy.AddRecommendation();

        cy.visit('http://localhost:3000/');

        cy.get('[data-cy="upvote-arrow"]').click();

        cy.get('div').contains('1');
    })

    it('O valor de um downvote deve ser atualizado', () => {
        cy.AddRecommendation();
        cy.visit('http://localhost:3000/')
        cy.get('[data-cy="downvote-arrow"]').click();
        cy.get('div').contains('-1');
    })
})