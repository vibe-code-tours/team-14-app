-- AlterTable: Remove single-column unique on email, add compound unique on (email, isAdmin)
-- This allows the same email to have both a user row (isAdmin=false) and an admin row (isAdmin=true).

-- Step 1: Drop the existing unique constraint on email
DROP INDEX "users_email_key";

-- Step 2: Create compound unique constraint on (email, is_admin)
CREATE UNIQUE INDEX "users_email_is_admin_key" ON "users"("email", "is_admin");
