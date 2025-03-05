-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verificationToken" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT,
    "customerId" TEXT,
    "variantId" TEXT,
    "isSubscribed" BOOLEAN NOT NULL DEFAULT false,
    "subscriptionStatus" TEXT DEFAULT 'inactive',
    "paymentStatus" TEXT DEFAULT 'none',
    "currentPeriodEnd" TIMESTAMP(3),
    "planType" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
