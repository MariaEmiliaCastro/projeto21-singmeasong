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

afterAll(async () => {
    // do something after all tests
    await scenarioFactory.disconnectPrisma();
});

describe('Rota GET /recommendations', () => {

    it('Deve retornar as 10 recomendações mais recentes', async () => {


        for(let i = 0; i < 11; i++){
            const recommendation = {
                name: faker.name.fullName(),
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            }
            await recommendationFactory.createRecommendation(recommendation);
        }

        const result = await request.get("/recommendations");

        expect(result.status).toBe(200);
        expect(result.body.length).toBe(10);
    });

    it('Deve retornar um array vazio caso não haja recomendações', async () => {
        const result = await request.get("/recommendations");

        expect(result.status).toBe(200);
        expect(result.body.length).toBe(0);
    });
})

describe('Rota GET /recommendations/:id', () => {

    it('Deve retornar uma recomendação específica', async () => {
        const recommendation = {
            name: faker.name.firstName(),
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        const createdRecommendation = await recommendationFactory.createRecommendation(recommendation);
        const result = await request.get(`/recommendations/${createdRecommendation.id}`);

        expect(result.status).toBe(200);
        expect(result.body.name).toBe(recommendation.name);
        expect(result.body.youtubeLink).toBe(recommendation.youtubeLink);
    });

    it('Deve retornar 404 para uma recomendação inexistente', async () => {
        const result = await request.get(`/recommendations/999`);

        expect(result.status).toBe(404);
    });
})


describe('Rota GET /recommendations/random', () => {

    it('Deve retornar uma recomendação aleatória', async () => {
        for(let i = 0; i < 100; i++){
            const recommendation = {
                name: faker.name.fullName(),
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            }
            await recommendationFactory.createRecommendationWithScore(recommendation, Math.round(Math.random() * 100));
        }

        jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
        const result = await request.get("/recommendations/random");

        expect(result.status).toBe(200);
        expect(result.body.score).toBeGreaterThan(10);
    });

    it('Deve retornar um array vazio caso não haja recomendações', async () => {
        const result = await request.get("/recommendations/random");

        expect(result.status).toBe(404);
        expect(result.body).toEqual({});
    });
})

describe('Rota GET /recommendations/top/:amount', () => {

    it('Deve retornar um array com o tamanho especificado no parametro amount', async () => {
        for(let i = 0; i < 11; i++){
            const recommendation = {
                name: faker.name.firstName(),
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            }
            await recommendationFactory.createRecommendation(recommendation);
        }

        const result = await request.get("/recommendations/top/5");

        expect(result.status).toBe(200);
        expect(result.body.length).toBe(5);
    });

    it('Deve retornar um array vazio caso não haja recomendações', async () => {
        const result = await request.get("/recommendations/top/5");

        expect(result.status).toBe(200);
        expect(result.body.length).toBe(0);
    });

    it('O array retornado deve estar ordenado por score', async () => {
        for(let i = 0; i < 11; i++){
            const recommendation = {
                name: faker.name.firstName(),
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            }
            await recommendationFactory.createRecommendationWithScore(recommendation, Math.round(Math.random() * 100));
        }

        const result = await request.get("/recommendations/top/5");

        expect(result.status).toBe(200);
        expect(result.body.length).toBe(5);
        expect(result.body[0].score).toBeGreaterThanOrEqual(result.body[1].score);
        expect(result.body[1].score).toBeGreaterThanOrEqual(result.body[2].score);
        expect(result.body[2].score).toBeGreaterThanOrEqual(result.body[3].score);
        expect(result.body[3].score).toBeGreaterThanOrEqual(result.body[4].score);
    });
})