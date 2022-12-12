/*
  Warnings:

  - Added the required column `creatat` to the `questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionnaireid_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_userid_fkey";

-- DropForeignKey
ALTER TABLE "questionnaire" DROP CONSTRAINT "questionnaire_creator_fkey";

-- DropForeignKey
ALTER TABLE "userquestionrelation" DROP CONSTRAINT "UserQuestionnaireRelation_questionnaireid_fkey";

-- DropForeignKey
ALTER TABLE "userquestionrelation" DROP CONSTRAINT "UserQuestionnaireRelation_userid_fkey";

-- AlterTable
ALTER TABLE "questionnaire" ADD COLUMN     "creatat" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" VARCHAR(200) NOT NULL;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionnaireid_fkey" FOREIGN KEY ("questionnaireid") REFERENCES "questionnaire"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questionnaire" ADD CONSTRAINT "questionnaire_creator_fkey" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userquestionrelation" ADD CONSTRAINT "UserQuestionnaireRelation_questionnaireid_fkey" FOREIGN KEY ("questionnaireid") REFERENCES "questionnaire"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userquestionrelation" ADD CONSTRAINT "UserQuestionnaireRelation_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
