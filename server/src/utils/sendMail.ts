import nodemailer, { Transporter } from 'nodemailer'
import path from 'path'
import ejs from 'ejs'
import dotenv from 'dotenv'

dotenv.config();

interface EmailOptions {
  email: string,
  subject: string,
  template: string,
  data: {[key: string]: any}
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transport: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const { email, subject, template, data } = options;

  // get the path to the template file
  const templatePath = path.join(__dirname, "../mails", template);

  // render the template
  const html = await ejs.renderFile(templatePath, data);

  // send the email
  const mailOptions = { 
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html
  }

  await transport.sendMail(mailOptions);
}

export default sendMail;
