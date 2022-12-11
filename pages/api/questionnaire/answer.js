const { PrismaClient } = require('@prisma/client');

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

	const count = await prisma.questionnaire.count({
		where: {
			id: req.body.questionnaireid
		}
	});
	
	if(!count)
	{
		res.status(404).json({
			msg: 'Questionnaire not found'
		});
		return;
	}

	let userID = null;
	if(req.body.userEmail)
	{
		const { id } = await prisma.users.findUnique({
			where: {
				email: req.body.userEmail
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