import { Router } from "express";

import { validate } from "../../shared/middleware/validate";

import { AuthController } from "./auth.controller";

import { signinSchema, signupSchema, signoutSchema } from "./auth.schemas";

const router = Router();

const authController = new AuthController();

router.post("/signup", validate(signupSchema), authController.signup);

router.post("/signin", validate(signinSchema), authController.signin);

router.post("/signout", validate(signoutSchema), authController.signout);

export { router as authRoutes };
