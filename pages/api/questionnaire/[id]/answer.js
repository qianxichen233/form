const { prisma } = require('../../../../lib/db');
const { getSession } = require('next-auth/react');

const { checkAnswerValidity } = require('../../../../lib/QuestionnaireValidity');
const { getUserIDByEmail } = require('../../../../lib/utility');

const handler = async (req, res) => {
    const { id } = req.query;

	const { content: questionnaire, published, creator } = await prisma.questionnaire.findUnique({
		where: {
			id: id
		},
		select: {
			creator: true,
			content: true,
			published: true
		}
	});
	 
	if(!questionnaire)
	{
		res.status(404).json({
			error: 'Questionnaire not found'
		});
		return;
	}

	const session = await getSession({req: req});

	let userID = null;
	if(session)
		userID = await getUserIDByEmail(session.user.email);

	if(req.method === 'POST')
	{
		await addAnswer(req, res, id, questionnaire, published, userID);
		return;
	}

	if(req.method === 'GET')
	{
		await getAnswer(req, res, id, userID, creator);
		return;
	}

	if(req.method === 'DELETE')
	{
		await deleteAnswer(req, res, id, userID, creator);
		return;
	}

	res.status(405).json({error: 'Unsupport Method!'});
	return;
}

const addAnswer = async (req, res, id, questionnaire, published, userID) => {
	if(!req.body.content)
	{
		res.status(406).json({error: 'Missing Field!'});
		return;
	}

	if(!published)
	{
		res.status(406).json({
			error: 'Questionnaire not published'
		});
		return;
	}

	try
	{
		if(!checkAnswerValidity(JSON.parse(questionnaire), req.body.content))
		{
			res.status(406).json({
				error: 'Invalid Answer Format'
			});
			return;
		}
	}
	catch
	{
		res.status(400).json({error: 'bad request'});
		return;
	}
	
	await prisma.answers.create({
		data: {
			userid: userID,
			content: JSON.stringify(req.body.content),
			questionnaireid: id
		}
	});

	res.status(201).json({
		msg: 'Success'
	});
}

const getAnswer = async (req, res, id, userID, creator) => {
	if(userID !== creator)
	{
		res.status(401).json({error: 'Unauthorized'});
		return;
	}
	
	let answers = await prisma.answers.findMany({
		where: {
			questionnaireid: id
		}, 
		select: {
			users: {
				select: {
					email: true
				}
			},
			content: true,
			id: true
		}
	});
	for(const answer of answers)
		answer.id = Number(answer.id);

	res.status(200).json(answers);
}

const deleteAnswer = async (req, res, id, userID, creator) => {
	if(userID !== creator)
	{
		res.status(401).json({error: 'Unauthorized'});
		return;
	}
	if(req.body.id)
	{
		const deleted = await prisma.answers.delete({
			where: {
				id: req.body.id
			}
		});
		if(!deleted)
		{
			res.status(404).json({error: 'Answer Not Found'});
			return;
		}
	}
	else
	{
		await prisma.answers.deleteMany({
			where: {
				questionnaireid: id
			}
		});
	}
	res.status(200).json({msg: 'success'});
	return;
}

export default handler;