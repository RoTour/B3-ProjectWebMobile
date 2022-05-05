-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_chatrooms" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL DEFAULT '/cdn/default_chat.png'
);
INSERT INTO "new_chatrooms" ("id", "title") SELECT "id", "title" FROM "chatrooms";
DROP TABLE "chatrooms";
ALTER TABLE "new_chatrooms" RENAME TO "chatrooms";
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "avatarUrl" TEXT NOT NULL DEFAULT '/cdn/default_avatar.jpeg'
);
INSERT INTO "new_users" ("banned", "email", "id", "name", "password", "username") SELECT "banned", "email", "id", "name", "password", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
