const { getSession } = require('next-auth/react');
const { prisma } = require('../../../../lib/db');

const { getUserIDByEmail, convertDataUrl } = require('../../../../lib/utility');

const fs = require('fs');
const path = require('path');

const handler = async (req, res) => {
    const { id } = req.query;

	const session = await getSession({req: req});
	if(!session)
	{
		res.status(401).json({error: 'Unauthenticated!'});
		return;
	}

	const userID = await getUserIDByEmail(session.user.email);
	if(!userID)
	{
		res.status(406).json({error: 'Invalid Email Address'});
		return;
	}

	try
	{
		const { creator } = await prisma.questionnaire.findUnique({
			where: {
				id: id
			},
			select: {
				creator: true
			}
		});
	
		if(creator !== userID)
		{
			res.status(401).json({error: 'Unauthorized'});
			return;
		}
	}
	catch(error)
	{
		res.status(404).json({
			msg: 'Questionnaire not Found'
		});
		return;
	}

	if(req.method === 'POST')
	{
		await updatePreview(req, res, id);
		return;
	}

    if(req.method === 'GET')
	{
		await getPreview(req, res, id);
		return;
	}

	res.status(405).json({error: 'Unsupport Method!'});
	return;
}

const updatePreview = async (req, res, id) => {
	if(!req.body.image)
	{
		res.status(406).json({error: 'Missing Field!'});
		return;
	}

	const filePath = path.join(process.cwd(), 'data', 'images', `${id}.png`);

	fs.writeFile(filePath, convertDataUrl(req.body.image), err => {
		if(err) console.log(err);
	});
	
	res.status(201).json({
		msg: 'Success'
	});
}

const getPreview = async (req, res, id) => {
	let filePath = path.join(process.cwd(), 'data', 'images', `${id}.png`);

	if(!fs.existsSync(filePath))
		filePath = path.join(process.cwd(), 'data', 'images', 'default.png');

	const imageBuffer = fs.readFileSync(filePath);

	res.setHeader('Content-Type', 'image/png');
  	res.status(200).send(imageBuffer);
}

export default handler;