import { validateEmail } from "../../lib/utility";

const { prisma } = require("../../lib/db");
const bcrypt = require("bcrypt");

const handler = async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ msg: "Method not support!" });
        return;
    }

    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(406).json({ msg: "Missing Field!" });
        return;
    }

    if (!validateEmail(req.body.email)) {
        res.status(406).json({ msg: "Invalid Email Format!" });
        return;
    }

    if (req.body.password.length < 8) {
        res.status(406).json({ msg: "Password Too Short!" });
        return;
    }

    if (
        req.body.password.length > 100 ||
        req.body.username.length > 100 ||
        req.body.email.length > 100
    ) {
        res.status(406).json({ msg: "Too Long!" });
        return;
    }

    const existedEmail = await prisma.users.count({
        where: {
            email: req.body.email,
        },
    });
    if (existedEmail > 0) {
        res.status(406).json({ msg: "Email Address Exists!" });
        return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.users.create({
        data: {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        },
    });

    res.status(201).json({ msg: "success!" });
};

export default handler;
