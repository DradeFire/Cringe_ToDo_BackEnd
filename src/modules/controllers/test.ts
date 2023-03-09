import { Request, Response } from "express"
import TestModel from "../../database/model/final/TestModel.model"

export const testController = async (_req: Request, res: Response) => {
    const data = await TestModel.findAll({})
    console.log(data)
    res.json({ testModels: data })
}