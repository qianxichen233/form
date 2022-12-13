const { prisma } = require('../../../lib/db');
const { getSession } = require('next-auth/react');

const fs = require('fs');
const path = require('path');

const { convertDataUrl } = require('../../../lib/utility');

const handler = async (req, res) => {
	if(req.method !== 'POST')
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

	if(!req.body.image ||
	   !req.body.id)
	{
		res.status(406).json({msg: 'Missing Field!'});
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
			id: req.body.id
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

	const filePath = path.join(process.cwd(), 'data', 'images', `${questionnaire.id}.png`);

	fs.writeFile(filePath, convertDataUrl(req.body.image), err => {
		if(err) console.log(err);
	});
	
	res.status(201).json({
		msg: 'Success'
	});
}

export default handler;