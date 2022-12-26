const { prisma } = require('../../../../lib/db');
const { getSession } = require('next-auth/react');

const { checkQuestionValidity } = require('../../../../lib/QuestionnaireValidity');
const { getUserIDByEmail } = require('../../../../lib/utility');

const fs = require('fs');
const path = require('path');

const handler = async (req, res) => {
    const { id } = req.query;

	const session = await getSession({req: req});
    let userID = null;
    if(session)
        userID = await getUserIDByEmail(session.user.email);

    if(req.method === 'GET')
    {
        await getForm(req, res, id, userID);
        return;
    }

	if(!session)
	{
		res.status(401).json({error: 'Unauthenticated!'});
		return;
	}

	if(!userID)
	{
		res.status(406).json({error: 'Invalid Email Address'});
		return;
	}

    if(req.method === 'DELETE')
    {
        await deleteForm(req, res, id, userID);
        return;
    }

	if(req.method === 'POST')
	{
        await updateForm(req, res, id, userID);
        return;
	}

    res.status(405).json({error: 'Unsupport Method!'});
    return;
}

const updateForm = async (req, res, id, userID) => {
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
			id: id
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
				id: id,
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
	if(typeof(req.body.publish) === 'boolean')
		newData.published = req.body.publish;
	if(req.body.content)
	{
		newData.content = JSON.stringify(req.body.content);
		newData.creatat = new Date()
	}

	await prisma.questionnaire.update({
		where: {
			id: id
		},
		data: newData
	});

	res.status(201).json({
		msg: 'Success'
	});
}

const deleteForm = async (req, res, id, userID) => {
    const questionnaire = await prisma.questionnaire.findUnique({
		where: {
			id: id
		},
		select: {
			creator: true
		}
	});
	
	if(!questionnaire)
	{
		res.status(404).json({
			error: 'Questionnaire not found!'
		});
		return;
	}
	
	if(questionnaire.creator !== userID)
	{
		res.status(401).json({error: 'Unauthorized'});
		return;
	}

    await prisma.questionnaire.delete({
        where: {
            id: id
        }
    });

	let filePath = path.join(process.cwd(), 'data', 'images', `${id}.png`);

	if(fs.existsSync(filePath))
		fs.unlink(filePath, err => {
			if(err)
				console.log(err);
		});

	res.status(200).json({
		msg: 'Success'
	});
}

const getForm = async (req, res, id, userID) => {
    const data = await prisma.questionnaire.findFirst({
        where: {
            id: id
        },
        select: {
            title: true,
            creatat: true,
            creator: true,
            content: true,
            published: true
        }
    });

    if(!data)
    {
        res.status(404).json({error: 'Questionnaire not found!'});
        return;
    }

    if(!data.published)
    {
        if(data.creator === userID)
        {
            res.status(200).json({
                content: data.content,
                title: data.title,
                creatat: data.creatat,
				published: data.published
            });
            return;
        }

        res.status(403).json({error: 'Questionnaire not published!'});
        return;
    }

    res.status(200).json({
        content: data.content,
        title: data.title,
        creatat: data.creatat,
		published: data.published
    });
}

export default handler;