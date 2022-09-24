import { prisma } from '../../src/database';

const scenarioFactory = {
    deleteAllData: async () => {
        await prisma.$transaction([
            prisma.$executeRaw`TRUNCATE TABLE recommendations`
        ]);
    },
    disconnectPrisma: async () => {
        await prisma.$disconnect();
    }
};

export default scenarioFactory;