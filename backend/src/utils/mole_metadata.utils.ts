import { BodyPart } from "@prisma/client";

export const isBodyPart = (val: any) => {
    return val === "frontBody" || val === "backBody";
};

export const bodyOrientationParser = (val: string): string => {
    const parsedOrientation = val === "Front Body" ? "frontBody" : "backBody";

    return parsedOrientation;
}