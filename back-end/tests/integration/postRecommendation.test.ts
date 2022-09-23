import jest from 'jest';
import supertest from 'supertest';
import app from '../../src/app';
import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database';

const request = supertest(app);

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

        await request.post("/recommendations").send(recommendation);
        const response = await request.post("/recommendations").send(recommendation);

        expect(response.status).toBe(409);
        
    })
})

afterAll(async () => {
    // do something after all tests
    await prisma.$disconnect();
  });