import { prisma } from "../database.js";

const testsRepository = {
    resetDatabase: async () => {
        await prisma.$transaction([
            prisma.$executeRaw`TRUNCATE TABLE recommendations`
        ]);
    }
}

export default testsRepository;