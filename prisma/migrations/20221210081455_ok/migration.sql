-- CreateTable
CREATE TABLE "answers" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userid" BIGINT,
    "questionnaireid" TEXT NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire" (
    "id" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "creator" BIGINT NOT NULL,
    "published" BOOLEAN NOT NULL,

    CONSTRAINT "questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(50),
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(200) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userquestionrelation" (
    "userid" BIGINT NOT NULL,
    "questionnaireid" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_id_key" ON "questionnaire"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuestionnaireRelation_userid_questionnaireid_key" ON "userquestionrelation"("userid", "questionnaireid");

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionnaireid_fkey" FOREIGN KEY ("questionnaireid") REFERENCES "questionnaire"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "questionnaire" ADD CONSTRAINT "questionnaire_creator_fkey" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userquestionrelation" ADD CONSTRAINT "UserQuestionnaireRelation_questionnaireid_fkey" FOREIGN KEY ("questionnaireid") REFERENCES "questionnaire"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userquestionrelation" ADD CONSTRAINT "UserQuestionnaireRelation_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
