-- CreateTable
CREATE TABLE "User_Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata_owner" TEXT NOT NULL,

    CONSTRAINT "User_Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mole_MetaData" (
    "id" TEXT NOT NULL,
    "body_Part" TEXT NOT NULL,
    "mole_owner" TEXT NOT NULL,

    CONSTRAINT "Mole_MetaData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mole_Assessment" (
    "id" TEXT NOT NULL,
    "risk_Assessment" TEXT NOT NULL,
    "model_Assessment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mole_id" TEXT NOT NULL,

    CONSTRAINT "Mole_Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_FitzPatrick" (
    "id" TEXT NOT NULL,
    "hairColor" TEXT NOT NULL,
    "eyeColor" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "skinTone" TEXT NOT NULL,
    "immune_Health" TEXT,
    "gender" TEXT NOT NULL,
    "genetics" TEXT,

    CONSTRAINT "User_FitzPatrick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Account_email_key" ON "User_Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Account_metadata_owner_key" ON "User_Account"("metadata_owner");

-- AddForeignKey
ALTER TABLE "User_Account" ADD CONSTRAINT "User_Account_metadata_owner_fkey" FOREIGN KEY ("metadata_owner") REFERENCES "User_FitzPatrick"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mole_MetaData" ADD CONSTRAINT "Mole_MetaData_mole_owner_fkey" FOREIGN KEY ("mole_owner") REFERENCES "User_Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mole_Assessment" ADD CONSTRAINT "Mole_Assessment_mole_id_fkey" FOREIGN KEY ("mole_id") REFERENCES "Mole_MetaData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
