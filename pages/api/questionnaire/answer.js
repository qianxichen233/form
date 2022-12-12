const { PrismaClient } = require('@prisma/client');
const { getSession } = require('next-auth/react');

const { checkAnswerValidity } = require('../../../lib/QuestionnaireValidity');

const prisma = new PrismaClient();

const handler = async (req, res) => {
	if(req.method !== 'POST')
	{
		res.status(405).json({msg: 'Unsupport Method!'});
		return;
	}

	if(!req.body.content ||
	   !req.body.questionnaireid)
	{
		res.status(406).json({msg: 'Missing Field!'});
		return;
	}

	const { content: questionnaire, published } = await prisma.questionnaire.findUnique({
		where: {
			id: req.body.questionnaireid
		},
		select: {
			content: true,
			published: true
		}
	});
	
	if(!questionnaire)
	{
		res.status(404).json({
			msg: 'Questionnaire not found'
		});
		return;
	}

	if(!published)
	{
		res.status(406).json({
			msg: 'Questionnaire not published'
		});
		return;
	}

	try
	{
		if(!checkAnswerValidity(JSON.parse(questionnaire), req.body.content))
		{
			res.status(406).json({
				msg: 'Invalid Answer Format'
			});
			return;
		}
	}
	catch
	{
		res.status(400).json({msg: 'bad request'});
		return;
	}

	const session = await getSession({req: req});

	let userID = null;
	if(session)
	{
		const { id } = await prisma.users.findUnique({
			where: {
				email: session.user.email
			},
			select: {
				id: true
			}
		});
		userID = id;
	}
	
	await prisma.answers.create({
		data: {
			userid: userID,
			content: JSON.stringify(req.body.content),
            questionnaireid: req.body.questionnaireid
		}
	});

	res.status(201).json({
		msg: 'Success'
	});
}

export default handler;