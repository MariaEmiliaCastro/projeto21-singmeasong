import testsRepository from "../repositories/testsRepository.js"

const testsService = {
    resetDatabase: async () => {
        await testsRepository.resetDatabase();
    }
}

export default testsService;