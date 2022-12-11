const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const handler = async (req, res) => {
    if(req.method !== 'POST')
    {
        res.status(405).json({msg: 'Method not support!'});
        return;
    }

    if(!req.body.username ||
       !req.body.email ||
       !req.body.password)
    {
        res.status(406).json({msg: 'Missing Field!'});
        return;
    }

    const existedEmail = await prisma.users.count({
        where: {
            email: req.body.email
        }
    });
    if(existedEmail > 0)
    {
        res.status(406).json({msg: 'Email Address Exists!'});
        return;
    }

    if(!validateEmail(req.body.email))
    {
        res.status(406).json({msg: 'Invalid Email Format!'});
        return;
    }

    if(req.body.password.length < 8)
    {
        res.status(406).json({msg: 'Password Too Short!'});
        return;
    }

    if(req.body.password.length > 100 ||
       req.body.username.length > 100 ||
       req.body.email.length > 100)
    {
        res.status(406).json({msg: 'Too Long!'});
        return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.users.create({
        data: {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        }
    });

    res.status(201).json({msg: 'success!'});
}

export default handler;