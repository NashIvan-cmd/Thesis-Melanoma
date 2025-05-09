import { Response, Request, NextFunction } from "express";
import { checkExistingFitzPatrickRecord, createFitzPatrick, updateFitzPatrick } from "../services/fitzpatrick.service";
import { ValidationError } from "../middlewares/error.middleware";
import { checkUserAgreement } from "../services/account.service";

export const fitzPatrickController = async(req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    console.log("Fitz request: ", req.body );
    try {
        
        const idRecordExist = await checkExistingFitzPatrickRecord(userId);

        let skinTypeAssessment = '';
        if (idRecordExist) {
            skinTypeAssessment = await updateFitzPatrick(req.body, idRecordExist);
        } else {
            skinTypeAssessment = await createFitzPatrick(req.body);
        }

        if (skinTypeAssessment == "false") {
            res.status(500).json({
                message: "Internal server error"
            })
        } else {
            res.status(200).json({
                skinTypeAssessment
            })
        }
    } catch (error) {
        next (error);
    }
}

// Validate for agreement and fitzpatrick
export const validateForCoreFeatures = async(req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query
    console.log("Req query", req.query);
    try {
        if (!userId) {
            throw new ValidationError("Id must be provided");
        }

        const parsedId = userId.toString();
        const record = await checkExistingFitzPatrickRecord(parsedId);
        const agreement = await checkUserAgreement(parsedId);

        res.status(200).json({
            record,
            agreement
        })
    } catch (error) {
        next (error);
    }
}