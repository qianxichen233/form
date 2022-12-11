const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const handler = async (req, res) => {
	if(req.method !== 'POST')
	{
		res.status(405).json({msg: 'Unsupport Method!'});
		return;
	}

	console.log(req.body);

	if(req.body.content === null ||
	   !req.body.creator ||
	   !req.body.id)
	{
		res.status(406).json({msg: 'Missing Field!'});
		return;
	}

	const { id: userID } = await prisma.users.findUnique({
		where: {
			email: req.body.creator
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

	const count = await prisma.questionnaire.count({
		where: {
			id: req.body.id
		}
	});
	
	if(!count) //create new questionnaire
	{
		console.log(Object.keys(req.body.content).length !== 0 && req.body.publish)

		await prisma.questionnaire.create({
			data: {
				content: JSON.stringify(req.body.content),
				creator: userID,
				id: req.body.id,
				published: Object.keys(req.body.content).length !== 0 && req.body.publish
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