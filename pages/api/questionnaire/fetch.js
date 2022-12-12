const { prisma } = require('../../../lib/db');
const { getUserIDByEmail } = require('../../../lib/utility');
const { getSession } = require('next-auth/react');

const handler = async (req, res) => {
    if(req.method !== 'POST')
    {
        res.status(405).json({msg: 'Unsupport Method!'});
        return;
    }

    if(!req.body.id)
    {
        res.status(406).json({msg: 'Missing Questionnaire ID!'});
        return;
    }

    const data = await prisma.questionnaire.findFirst({
        where: {
            id: req.body.id
        },
        select: {
            title: true,
            creatat: true,
            creator: true,
            content: true,
            published: true
        }
    });

    if(!data)
    {
        res.status(404).json({msg: 'Questionnaire not found!'});
        return;
    }

    if(!data.published)
    {
        const session = await getSession({req: req});
        if(session)
        {
            const userID = await getUserIDByEmail(session.user.email);
            if(data.creator === userID)
            {
                res.status(200).json(data.content);
                return;
            }
        }

        res.status(403).json({msg: 'Questionnaire not published!'});
        return;
    }

    res.status(200).json(data.content);
}

export default handler;