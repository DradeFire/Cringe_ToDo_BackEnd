import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { testController } from "../modules/controllers/test";

const testRoutes = Router()

testRoutes.get('/', asyncHandler(testController))

export = testRoutes