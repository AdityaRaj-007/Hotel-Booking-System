import Router from "express";
import { validate } from "../../shared/middleware/validationMiddleware";
import { LoginSchema, SignUpSchema } from "./auth.schema";
import { loginUser, signupUser } from "./auth.controller";

const router = Router();

router.post("/signup", validate(SignUpSchema), signupUser);
router.post("/login", validate(LoginSchema), loginUser);

export default router;
