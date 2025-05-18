import express from "express";
import { getAllLatestMoleController, getAllMolesWithOrientationController, moleMetadataController, recheckMoleController, updateMoleController } from "../controllers/mole_metadata.controller";
import { validateToken } from "../controllers/authenticate.controller";
import { getAllMoleByUserIdWithOrientation } from "../services/mole_metadata.service";

const router = express.Router();

router.post('/v1/metadata/mole', validateToken, moleMetadataController);
router.post('/v1/details/mole', validateToken, getAllLatestMoleController);
router.post('/v1/details/orientation/mole', validateToken, getAllMolesWithOrientationController);
router.post('/v1/recheck/mole', validateToken, recheckMoleController);

router.patch('/v1/name/mole', validateToken, updateMoleController);

export default router;