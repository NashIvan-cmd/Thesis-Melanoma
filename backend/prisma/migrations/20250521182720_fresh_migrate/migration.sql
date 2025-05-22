-- CreateEnum
CREATE TYPE "BodyPart" AS ENUM ('frontBody', 'backBody');

-- CreateTable
CREATE TABLE "User_Account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "policyAgreement" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mole_Assessment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "risk_assessment" INTEGER NOT NULL,
    "risk_summary" TEXT NOT NULL,
    "model_assessment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mole_id" TEXT NOT NULL,

    CONSTRAINT "Mole_Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_FitzPatrick" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "hair_color" INTEGER NOT NULL,
    "eye_color" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "skin_tone" INTEGER NOT NULL,
    "freckles" INTEGER NOT NULL,
    "skinSunReaction" INTEGER NOT NULL,
    "turnBrownDegree" INTEGER NOT NULL,
    "sunExposureTurnBrown" INTEGER NOT NULL,
    "faceReaction" INTEGER NOT NULL,
    "bodyLastSunExposure" INTEGER NOT NULL,
    "exposedFaceToSun" INTEGER NOT NULL,
    "immune_health" TEXT,
    "gender" TEXT NOT NULL,
    "genetics" TEXT,
    "skinType" TEXT NOT NULL,
    "averageSunExposure" TEXT,
    "user_account_foreignkey" TEXT NOT NULL,

    CONSTRAINT "User_FitzPatrick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mole_MetaData" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "body_orientation" "BodyPart" NOT NULL,
    "body_part" TEXT NOT NULL,
    "mole_owner" TEXT NOT NULL,
    "x_coordinate" INTEGER NOT NULL,
    "y_coordinate" INTEGER NOT NULL,
    "cloudId" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mole_MetaData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Account_username_key" ON "User_Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_Account_email_key" ON "User_Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_FitzPatrick_user_account_foreignkey_key" ON "User_FitzPatrick"("user_account_foreignkey");

-- AddForeignKey
ALTER TABLE "Mole_Assessment" ADD CONSTRAINT "Mole_Assessment_mole_id_fkey" FOREIGN KEY ("mole_id") REFERENCES "Mole_MetaData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_FitzPatrick" ADD CONSTRAINT "User_FitzPatrick_user_account_foreignkey_fkey" FOREIGN KEY ("user_account_foreignkey") REFERENCES "User_Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mole_MetaData" ADD CONSTRAINT "Mole_MetaData_mole_owner_fkey" FOREIGN KEY ("mole_owner") REFERENCES "User_Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
