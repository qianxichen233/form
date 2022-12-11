import CredentialProvider from "next-auth/providers/credentials"
 
import NextAuth from 'next-auth';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
 
export default NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialProvider({
            name: "credentials",
            authorize: async (credentials) => {
                const user = await prisma.users.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if(!user)
                    throw new Error('User not found!');

                if(!(await bcrypt.compare(credentials.password, user.password)))
                    throw new Error('Wrong Password');

                return {
                    email: user.email,
                    username: user.username
                };
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = user)
            return token
        },
        session: async ({ session, token }) => {
            session.user = token.user
            return session
        }
    }
});