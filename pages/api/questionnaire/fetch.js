const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
            content: true,
            published: true
        }
    });

    if(!data.published)
    {
        res.status(403).json({msg: 'Questionnaire not published!'});
        return;
    }

    res.status(200).json(data.content);
}

export default handler;