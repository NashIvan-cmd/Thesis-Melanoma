import express from "express";
import { authenticateLogin, createAccount } from "../controllers/account.controller";

const router = express.Router();

router.post('/v1/auth/account', authenticateLogin);
router.post('/v1/new/account', createAccount);
// router.post('/v1/reset/password', requestPasswordReset);

export default router;