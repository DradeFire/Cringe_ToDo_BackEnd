import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireToken } from "../middleware/requireToken";
import { changePassword } from "../modules/controllers/pass";

const passRoutes = Router();

passRoutes.patch(
  "/changepass",
  asyncHandler(requireToken),
  asyncHandler(changePassword)
);

export { passRoutes };
