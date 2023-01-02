const { prisma } = require("../../../../lib/db");
const { getSession } = require("next-auth/react");

const { getUserIDByEmail, validateEmail } = require("../../../../lib/utility");
const { sendEmail } = require("../../../../lib/emailHandler");

const handler = async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Unsupport Method!" });
        return;
    }

    const { id } = req.query;

    const session = await getSession({ req: req });
    let userID = null;
    if (session) userID = await getUserIDByEmail(session.user.email);

    const form = await prisma.questionnaire.findUnique({
        where: {
            id: id,
        },
        select: {
            published: true,
            creator: true,
        },
    });

    if (!form.published) {
        res.status(403).json({ error: "form not published" });
        return;
    }

    if (!session) {
        res.status(401).json({ error: "Unauthenticated!" });
        return;
    }

    if (!userID) {
        res.status(406).json({ error: "Invalid Email Address" });
        return;
    }

    if (form.creator !== userID) {
        res.status(401).json({ error: "Unauthenticated" });
        return;
    }

    if (!validateEmail(req.body.options.to)) {
        res.status(406).json({ error: "Invalid Email Format" });
        return;
    }

    const targetURL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/questionnaire/${id}/answer`;

    const result = await sendEmail({
        to: req.body.options.to,
        subject: req.body.options.subject,
        message: req.body.options.message + " " + targetURL,
    });
    if (result.error) {
        console.log(result.error);
        res.status(500).json({ error: "send email failed" });
    }

    res.status(200).json({ msg: "success" });
    return;
};

export default handler;
