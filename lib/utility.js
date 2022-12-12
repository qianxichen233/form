import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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