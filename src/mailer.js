const nodemailer = require('nodemailer');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');

function testMailer() {
    return process.env.MAIL_USE_SMTP === 'true' || process.env.MAIL_USE_EXCHANGE === 'true';
}

function getMailer() {
    if (process.env.MAIL_USE_SMTP === 'true') {
        return nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_USE_SSL === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else if (process.env.MAIL_USE_EXCHANGE === 'true') {
        // Create Microsoft Graph client
        const credential = new ClientSecretCredential(process.env.AZURE_TENENT_ID, process.env.AZURE_CLIENT_ID, process.env.AZURE_CLIENT_SECRET);
        const graphClient = Client.initWithMiddleware({
            authProvider: {
                getAccessToken: async () => {
                    const token = await credential.getToken('https://graph.microsoft.com/.default');
                    return token.token;
                },
            },
        });

        // Custom transport for Microsoft Graph API
        const graphTransport = {
            name: 'MicrosoftGraph',
            version: '1.0.0',
            send: async (mail, callback) => {
                const message = {
                    subject: mail.data.subject,
                    body: {
                        contentType: 'HTML',
                        content: mail.data.html || mail.data.text,
                    },
                    toRecipients: mail.data.to.split(',').map(email => ({
                        emailAddress: { address: email.trim() },
                    })),
                    ccRecipients: mail.data.cc
                        ? mail.data.cc.split(',').map(email => ({
                            emailAddress: { address: email.trim() },
                        }))
                        : [],
                    bccRecipients: mail.data.bcc
                        ? mail.data.bcc.split(',').map(email => ({
                            emailAddress: { address: email.trim() },
                        }))
                        : [],
                };

                try {
                    await graphClient.api(`/users/${process.env.FROM_ADDRESS}/sendMail`).post({ message });
                    callback(null, { accepted: mail.data.to, rejected: [] });
                } catch (error) {
                    callback(error);
                }
            },
        };

        return nodemailer.createTransport(graphTransport);
    }

    throw new Error('No mail provider configured');
}

module.exports = {
    getMailer,
    testMailer
};
