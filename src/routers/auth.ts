import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireToken } from "../middleware/requireToken";
import { login, registration, logout, me } from "../modules/controllers/auth";

const authRoutes = Router();


authRoutes.get(
  "/me",
  asyncHandler(requireToken),
  asyncHandler(me)
);
authRoutes.post("/login", asyncHandler(login));
authRoutes.post("/logout", asyncHandler(logout));//token&&&&
authRoutes.post("/registration", asyncHandler(registration));

export {
  authRoutes
};
