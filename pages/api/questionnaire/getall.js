const { prisma } = require('../../../lib/db');
const { getSession } = require('next-auth/react');

const handler = async (req, res) => {
    if(req.method !== 'GET')
    {
        res.status(405).json({msg: 'Unsupport Method!'});
        return;
    }

    const session = await getSession({req: req});
    if(!session)
    {
        res.status(401).json({msg: 'Unauthorized!'});
        return;
    }

    const User = await prisma.users.findUnique({
        where: {
            email: session.user.email
        },
        select: {
            id: true
        }
    });
    const userID = User?.id;

    if(!userID)
    {
        res.status(403).json({msg: 'Unexist User!'});
        return;
    }

    const data = await prisma.questionnaire.findMany({
        where: {
            creator: userID
        },
        select: {
            id: true,
            published: true,
            creatat: true,
            title: true
        }
    });

    res.status(200).json(data);
}

export default handler;