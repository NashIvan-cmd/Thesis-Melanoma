import express from "express"
import { fitzPatrickController, validateForCoreFeatures } from "../controllers/fitzpatrick.controller";
import { validateToken } from "../controllers/authenticate.controller";

const router = express.Router();

router.post("/v1/fitzpatrick", validateToken, fitzPatrickController);
router.get("/v1/check", validateForCoreFeatures);

export default router;