/*
  Warnings:

  - You are about to drop the `_ChatroomToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `chatrooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_ChatroomToUser_B_index";

-- DropIndex
DROP INDEX "_ChatroomToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ChatroomToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserChats" (
    "userId" INTEGER NOT NULL,
    "chatroomId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    PRIMARY KEY ("userId", "chatroomId"),
    CONSTRAINT "UserChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserChats_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "chatrooms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_chatrooms" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "chatrooms_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_chatrooms" ("id", "title") SELECT "id", "title" FROM "chatrooms";
DROP TABLE "chatrooms";
ALTER TABLE "new_chatrooms" RENAME TO "chatrooms";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
