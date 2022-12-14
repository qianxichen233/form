import { prisma } from './db';

export const generateRandomString = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const getUserIDByEmail = async (email) => {
    const { id: userID } = await prisma.users.findUnique({
        where: {
            email: email
        },
        select: {
            id: true
        }
    });
    return userID;
}

export const convertDataUrl = (dataurl) => {
    const regex = /^data:.+\/(.+);base64,(.*)$/;
    const matches = dataurl.match(regex);
    const data = matches[2];
    return Buffer.from(data, 'base64');
}