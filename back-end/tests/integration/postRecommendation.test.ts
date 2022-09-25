import supertest from 'supertest';
import app from '../../src/app';
import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database';
import scenarioFactory from '../factories/scenarioFactory';
import recommendationFactory from '../factories/recommendationFactory';

const request = supertest(app);

beforeEach(async () => {
    await scenarioFactory.deleteAllData();
})

describe ('Rota POST /recommendations', () =>{

    it('Deve cadastrar uma nova recomendação', async () => {
        
        const recommendation = {
            name: faker.name.firstName(),
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        const result = await request.post("/recommendations").send(recommendation);

        expect(result.status).toBe(201);
    })

    it('Não deve ser capaz de cadastrar uma recomendação duplicada', async () => {
        const recommendation = {
            name: faker.name.firstName(),
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        await recommendationFactory.createRecommendation(recommendation);
        const response = await request.post("/recommendations").send(recommendation);

        expect(response.status).toBe(409);
        
    })
})

describe('Rota POST /recommendations/:id/upvote', () => {

    it('Deve dar um upvote em uma recomendação', async () => {
        const recommendation = {
            name: faker.name.firstName(),
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        const createdRecommendation = await recommendationFactory.createRecommendation(recommendation);
        console.log(createdRecommendation)
        const result = await request.post(`/recommendations/${createdRecommendation.id}/upvote`);

        console.log("AAAAAAAAAAA: ", result.body);
        expect(result.status).toBe(200);
    })

    it('Não deve ser capaz de dar um upvote em uma recomendação inexistente', async () => {
        const result = await request.post(`/recommendations/999/upvote`);

        expect(result.status).toBe(404);
    })
})

describe('Rota POST /recommendations/:id/downvote', () => {

    it('Deve dar um downvote em uma recomendação', async () => {
        const recommendation = {
            name: faker.name.firstName(),
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        const createdRecommendation = await recommendationFactory.createRecommendation(recommendation);
        const result = await request.post(`/recommendations/${createdRecommendation.id}/downvote`);

        expect(result.status).toBe(200);
    })

    it('Não deve ser capaz de dar um downvote em uma recomendação inexistente', async () => {
        const result = await request.post(`/recommendations/999/downvote`);

        expect(result.status).toBe(404);
    })

    it('Deve excluir uma recomendação caso ela fique abaixo de -5 pontos', async () => {
        const recommendation = {
            name: faker.name.firstName(),
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        const createdRecommendation = await recommendationFactory.createRecommendation(recommendation);
        for(let i = 0; i < 5; i++){
            await request.post(`/recommendations/${createdRecommendation.id}/downvote`);
        }

        const result = await request.post(`/recommendations/${createdRecommendation.id}/downvote`);

        const getExcludedRecommendation = await prisma.recommendation.findUnique({
            where: {
                id: createdRecommendation.id
            }
        });

        expect(result.status).toBe(200);
        expect(getExcludedRecommendation).toBeNull();
    })	
})

afterAll(async () => {
    // do something after all tests
    await scenarioFactory.disconnectPrisma();
});