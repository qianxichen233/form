const nodemailer = require("nodemailer");
const { google } = require("googleapis");

export const sendEmail = async (config) => {
    const clientid = process.env.EMAIL_CLIENTID;
    const secret = process.env.EMAIL_SECRET;
    const redirect_url = process.env.EMAIL_REDIRECTURL;
    const refresh_token = process.env.EMAIL_REFRESHTOKEN;

    const oAuth2Client = new google.auth.OAuth2(clientid, secret, redirect_url);
    oAuth2Client.setCredentials({ refresh_token: refresh_token });

    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "developer.cqx@gmail.com",
                clientId: clientid,
                clientSecret: secret,
                refreshToken: refresh_token,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: "developer.cqx@gmail.com",
            to: config.to,
            subject: config.subject,
            text: config.message,
        };

        const result = await transport.sendMail(mailOptions);
        return { success: result };
    } catch (error) {
        return { error };
    }
};
