import { Request, Response } from "express"
import testsService from "../services/testsService.js";

const testsController = {

    resetDatabase: async (req : Request, res: Response) => {
        await testsService.resetDatabase();

        res.sendStatus(200);
    }
}

export default testsController;