const { PrismaClient } = require('@prisma/client');
const { getSession } = require('next-auth/react');

const prisma = new PrismaClient();

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

    const { id: userID } = await prisma.users.findUnique({
        where: {
            email: session.user.email
        },
        select: {
            id: true
        }
    })

    const data = await prisma.questionnaire.findMany({
        where: {
            creator: userID
        },
        select: {
            id: true,
            published: true
        }
    });

    res.status(200).json(data);
}

export default handler;