const { getSession } = require('next-auth/react');
const { prisma } = require('../../../../lib/db');

const fs = require('fs');
const path = require('path');

const handler = async (req, res) => {
    const { id } = req.query;

    if(req.method !== 'GET')
    {
		res.status(405).json({msg: 'Unsupport Method!'});
		return;
    }

	const session = await getSession({req: req});
	if(!session)
	{
		res.status(401).json({msg: 'Unauthenticated!'});
		return;
	}
    
    const { id: userID } = await prisma.users.findUnique({
		where: {
			email: session.user.email
		},
		select: {
			id: true
		}
	});
	if(!userID)
	{
		res.status(406).json({msg: 'Invalid Email Address'});
		return;
	}

    const questionnaire = await prisma.questionnaire.findUnique({
		where: {
			id: id
		},
		select: {
			id: true,
			creator: true
		}
	});
	
	if(!questionnaire)
	{
		res.status(404).json({
			msg: 'Questionnaire not Found'
		});
		return;
	}

    if(questionnaire.creator !== userID)
	{
		res.status(401).json({msg: 'Unauthenticated'});
		return;
	}

	let filePath = path.join(process.cwd(), 'data', 'images', `${id}.png`);

	if(!fs.existsSync(filePath))
		filePath = path.join(process.cwd(), 'data', 'images', 'default.png');

	const imageBuffer = fs.readFileSync(filePath);

	res.setHeader('Content-Type', 'image/png');
  	res.status(200).send(imageBuffer);
}

export default handler;