const { prisma } = require("../../../../lib/db");
const { getSession } = require("next-auth/react");

const { getUserIDByEmail } = require("../../../../lib/utility");

const handler = async (req, res) => {
    const { id } = req.query;

    const session = await getSession({ req: req });
    let userID = null;
    if (session) userID = await getUserIDByEmail(session.user.email);

    if (!session) {
        res.status(401).json({ error: "Unauthenticated!" });
        return;
    }

    if (!userID) {
        res.status(406).json({ error: "Invalid Email Address" });
        return;
    }

    if (req.method === "POST") {
        await updateSettings(req, res, userID, id);
        return;
    }

    res.status(405).json({ error: "Unsupport Method!" });
    return;
};

const updateSettings = async (req, res, user, id) => {
    const questionnaire = await prisma.questionnaire.findUnique({
        where: {
            id: id,
        },
        select: {
            creator: true,
        },
    });

    if (questionnaire.creator !== user) {
        res.status(401).json({ error: "Unauthenticated" });
        return;
    }

    if (!req.body.options) {
        res.status(406).json({ errer: "missing options" });
        return;
    }

    await prisma.questionnaire.update({
        where: {
            id: id,
        },
        data: {
            options: JSON.stringify(req.body.options),
        },
    });

    res.status(201).json({
        msg: "Success",
    });
};

export default handler;
