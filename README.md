# Template Mailer

This is a simple webapp for saving and sending template emails.

## ⚠️ Disclaimer

This web application is **NOT secure** and should **NOT be used on publicly accessible servers or in production environments**. It is provided for **educational purposes, experimentation, and local usage only**. The code has not been subjected to thorough security testing and may contain vulnerabilities that could be exploited.

By using this web application, you agree that:

1. You **assume all risks** associated with its use.
2. The authors and contributors are **not liable for any damages, losses, or security breaches** resulting from the use of this application.
3. You will not deploy this application on any publicly accessible server or use it for any purpose other than those explicitly stated above.

If you choose to improve and secure this application, contributions to the project are welcome via pull requests.

## Required Environment Variables

Set the environment variables as defined in the `.env-example` file, and save that file as `.env`.

| Environment Variable | Description |
|----------------------|-------------|
| `DATABASE_LOCATION`  | Path to the database file. |
| `PORT`               | Port number on which the webapp will run. |
| `FROM_ADDRESS`       | Your email address. |
| `SESSION_SECRET`     | Secure string to secure your sessions. |
| `MAIL_USE_SMTP`      | True/false to use SMTP to send mail. |
| `SMTP_SERVER`        | SMTP server name for your email service. |
| `SMTP_PORT`          | Port to use on your SMTP server. |
| `SMTP_USE_SSL`       | True/false to use SSL. |
| `SMTP_USER`          | SMTP user name. |
| `SMTP_PASS`          | SMTP password. |
| `MAIL_USE_EXCHANGE`  | True/false to use Exchange Online. |
| `AZURE_TENENT_ID`    | See Microsoft's docs on creating an Azure Graph API app with Mail.Send permissions for your organization |
| `AZURE_CLIENT_ID`    | See Microsoft's docs on creating an Azure Graph API app with Mail.Send permissions for your organization |
| `AZURE_CLIENT_SECRET`| See Microsoft's docs on creating an Azure Graph API app with Mail.Send permissions for your organization |

## How to use

Run `node index.js` to start the webapp. Your browser should open to the page to start saving and sending template emails.

## Tips

Try setting `DATABASE_LOCATION` to a shared drive to have multiple people share templates.
