import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database';
import { CreateRecommendationData } from '../../src/services/recommendationsService';

const recommendationFactory = {
    createRecommendation: async (data: CreateRecommendationData) => {
        const recommendation = await prisma.recommendation.create({
            data: {
                name: data.name,
                youtubeLink: data.youtubeLink
            }
        });

        return recommendation;
    },
    createRecommendationWithScore: async (data: CreateRecommendationData, score: number) => {
        const recommendation = await prisma.recommendation.create({
            data: {
                name: data.name,
                youtubeLink: data.youtubeLink,
                score: score
            }
        });

        return recommendation;
    }
}

export default recommendationFactory;