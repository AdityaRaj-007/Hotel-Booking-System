import Router from "express";
import { AddReview } from "./reviews.controller";
import { validate } from "../../shared/middleware/validationMiddleware";
import { AddReviewSchema } from "./reviews.schema";

const router = Router();

router.post("/", validate(AddReviewSchema), AddReview);

export default router;
