import express from "express";
import { mole_metadata_controller } from "../controllers/mole_metadata.controller";
import { validateToken } from "../controllers/authenticate.controller";

const router = express.Router();

router.post('/v1/metadata/mole', validateToken, mole_metadata_controller);

export default router;