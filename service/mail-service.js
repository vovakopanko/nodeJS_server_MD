const nodemailer = require("nodemailer");

class MaiLService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Activated your account on " + process.env.API_URL,
      text: "",
      html: `
      <div>
      <h1>For activated your account follow the link</h1>
      <a href="${link}">${link}</a>
      </div>
      `,
    });
  } // parameters : email and link
}

module.exports = new MaiLService();
