const { prisma } = require('../../../lib/db');
const { getSession } = require('next-auth/react');

const { checkQuestionValidity } = require('../../../lib/QuestionnaireValidity');

const handler = async (req, res) => {
	if(req.method !== 'POST')
	{
		res.status(405).json({error: 'Unsupport Method!'});
		return;
	}
	
	const session = await getSession({req: req});
	if(!session)
	{
		res.status(401).json({error: 'Unauthenticated!'});
		return;
	}

	if(!req.body.id)
	{
		res.status(406).json({error: 'Missing Field!'});
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
		res.status(406).json({error: 'Invalid Email Address'});
		return;
	}

	if(req.body.publish) //make sure published questionnaire is valid
	{
		try
		{
			if(!checkQuestionValidity(req.body.content))
			{
				res.status(406).json({error: 'Invalid Questionnaire Format'});
				return;
			}
		}
		catch
		{
			res.status(400).json({error: 'Bad Request'});
			return;
		}
	}

	const questionnaire = await prisma.questionnaire.findUnique({
		where: {
			id: req.body.id
		},
		select: {
			creator: true
		}
	});
	
	if(!questionnaire) //create new questionnaire
	{
		await prisma.questionnaire.create({
			data: {
				content: JSON.stringify(req.body.content || {}),
				title: req.body.title,
				creator: userID,
				creatat: new Date(),
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
	if(questionnaire.creator !== userID)
	{
		res.status(401).json({error: 'Unauthenticated'});
		return;
	}

	let newData = {
		title: req.body.title
	};
	if(req.body.publish)
		newData.published = req.body.publish;
	if(req.body.content)
	{
		newData.content = JSON.stringify(req.body.content);
		newData.creatat = new Date()
	}

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