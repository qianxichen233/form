import { prisma } from "./db";

export const generateRandomString = (length) => {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

export const getUserIDByEmail = async (email) => {
    const { id: userID } = await prisma.users.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
        },
    });
    return userID;
};

export const convertDataUrl = (dataurl) => {
    const regex = /^data:.+\/(.+);base64,(.*)$/;
    const matches = dataurl.match(regex);
    const data = matches[2];
    return Buffer.from(data, "base64");
};

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const getFormTitle = (questions) => {
    return questions
        .find((question) => {
            return question.content.type === "title";
        })
        .content.title.blocks.map(
            (block) => (!block.text.trim() && "\n") || block.text
        )
        .join("\n");
};
