import jest from 'jest';
import supertest from 'supertest';
import app from '../../src/app';
import { prisma } from "../../src/database";

const request = supertest(app);

describe ('Rota POST /recommendation', () =>{

    it('Deve cadastrar uma nova recomendação', () => {

    })

    it('Não deve ser capaz de cadastrar uma recomendação duplicada', () => {

    })
})