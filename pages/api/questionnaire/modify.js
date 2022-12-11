const { PrismaClient } = require('@prisma/client');
const { getSession } = require('next-auth/react');

const { checkQuestionValidity } = require('../../../lib/QuestionnaireValidity');

const prisma = new PrismaClient();

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

	if(req.body.content === null ||
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

	if(req.body.publish) //make sure published questionnaire is valid
	{
		try
		{
			if(!checkQuestionValidity(req.body.content))
			{
				res.status(406).json({msg: 'Invalid Questionnaire Format'});
				return;
			}
		}
		catch
		{
			res.status(400).json({msg: 'Bad Request'});
			return;
		}
	}

	const count = await prisma.questionnaire.count({
		where: {
			id: req.body.id
		}
	});
	
	if(!count) //create new questionnaire
	{
		await prisma.questionnaire.create({
			data: {
				content: JSON.stringify(req.body.content),
				creator: userID,
				id: req.body.id,
				published: req.body.publish
			}
		});
		
		res.status(201).json({
			msg: 'Success'
		});

		return;
	}
	
	//modify existing questionnaire
	let newData = {
		content: JSON.stringify(req.body.content)
	};
	if(req.body.publish)
		newData.published = req.body.publish;

	await prisma.questionnaire.update({
		where: {
			id: req.body.id
		},
		data: newData
	});

	res.status(201).json({
		msg: 'Success'
	});
}

export default handler;