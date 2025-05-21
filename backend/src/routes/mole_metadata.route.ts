import express from "express";
import { 
  getAllLatestMoleController, 
  getAllMolesWithOrientationController, 
  moleMetadataController, 
  recheckMoleController, 
  updateMoleController, 
  fetchMoleById 
} from "../controllers/mole_metadata.controller";
import { validateToken } from "../controllers/authenticate.controller";

const router = express.Router();

router.post('/v1/metadata/mole', validateToken, moleMetadataController);
router.post('/v1/details/mole', validateToken, getAllLatestMoleController);
router.post('/v1/details/orientation/mole', validateToken, getAllMolesWithOrientationController);
router.post('/v1/recheck/mole', validateToken, recheckMoleController);
router.post('/v1/fetch/mole', validateToken, fetchMoleById); // Add this new route
router.patch('/v1/name/mole', validateToken, updateMoleController);

export default router;