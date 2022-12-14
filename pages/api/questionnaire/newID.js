const { prisma } = require('../../../lib/db');
const { generateRandomString } = require('../../../lib/utility');

const handler = async (req, res) => {
    if(req.method !== 'GET')
    {
        res.status(405).json('Unsupport Method');
        return;
    }

    let id;
    let ExistId;
    do
    {
        id = generateRandomString(10);
        ExistId = await prisma.questionnaire.count({
            where: {
                id: id
            }
        })
    }
    while(ExistId > 0);

    res.status(200).json({id: id});
}

export default handler;