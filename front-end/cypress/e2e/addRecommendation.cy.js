import { faker } from '@faker-js/faker';

describe('Testa a adição de uma recomendação', () => {
  it('Deve ser capaz de adicionar uma recomendação nova', () => {
    const name = faker.name.fullName();
    cy.visit('http://localhost:3000/')

    cy.get('input[placeholder="Name"]').type(name);
    cy.get('input[placeholder="https://youtu.be/..."]').type('https://www.youtube.com/watch?v=EDwb9jOVRtU')

    cy.intercept('POST', 'http://localhost:5000/recommendations').as('createRecommendation')

    cy.get('[data-cy="createRecommendationBtn"]').click();

    cy.wait('@createRecommendation');
  });

  it('Não deve ser capaz de adicionar uma recomendação duplicada', () =>{
    const recommendation = {
      name: faker.name.fullName(),
      youtubeLink: 'https://www.youtube.com/watch?v=1qBzMnkGt28'
    }

    cy.request('POST', 'http://localhost:5000/recommendations', recommendation).then(() => {
      cy.request({
          url: 'http://localhost:5000/recommendations', 
          failOnStatusCode: false,
          body: recommendation
        }).then(() =>{

          cy.on('window:alert', (text) => {
            expect(text).to.contains('This is an alert!');
          });
      })
    })
  })
})