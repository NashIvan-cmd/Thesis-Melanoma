import express from "express";
import { getAllLatestMoleController, moleMetadataController } from "../controllers/mole_metadata.controller";
import { validateToken } from "../controllers/authenticate.controller";

const router = express.Router();

router.post('/v1/metadata/mole', validateToken, moleMetadataController);
router.post('/v1/details/mole', validateToken, getAllLatestMoleController);

export default router;