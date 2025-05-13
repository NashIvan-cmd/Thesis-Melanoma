import express from "express";
import { 
    agreementToTerms, 
    authenticateLogin, 
    changePasswordController, 
    checkAgreementController, 
    createAccount, 
    generateCode, 
    requestPasswordReset, 
    resetPasswordController} from "../controllers/account.controller";
import { validateToken } from "../controllers/authenticate.controller";

const router = express.Router();

router.post('/v1/auth/account', authenticateLogin);
router.post('/v1/new/account', createAccount);
router.post('/v1/code/account', generateCode);
router.post('/v1/agreement/account', validateToken, agreementToTerms);
router.post('/v1/password/change', changePasswordController);
router.post('/v1/password/verify/details/reset', requestPasswordReset as any);
router.post('/v1/password/reset', resetPasswordController);
// router.post('/v1/reset/password', requestPasswordReset);

router.get('/v1/agreement/check', checkAgreementController);

export default router;