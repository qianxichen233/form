const { prisma } = require("../../../../lib/db");
const { getSession } = require("next-auth/react");

const { getUserIDByEmail } = require("../../../../lib/utility");

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

    //send email
    res.status(200).json({ msg: "success" });
    return;
};

export default handler;
