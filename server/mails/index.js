import nodemailer from "nodemailer"
import { CREDENTIALS, WEBSITE_URL } from "./mail.config.js"

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      tls: {
        ciphers: "SSLv3",
      },
      auth: {
        user: CREDENTIALS.APP_EMAIL,
        pass: CREDENTIALS.APP_PASSWORD,
      },
    })
    this.dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
    }
  }

  async sendAccountConfirmationMail(to, name, code) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to: to,
        subject: " Please confirm your email adress !",
        text: " Please confirm your email adress !",
        html: `<div> 
                 <h1> Thanks for your registration ${name} &#129321; ! </h1>
                 <p> In order to complete your registration and to verify your account, please follow this <a href="${WEBSITE_URL}/auth/${encodeURIComponent(
          code
        )}"> link </a> </p>
               </div> `,
      })
    } catch (error) {
      console.log("Account confirmation email not sent !")
    }
  }

  async sendPasswordResetRequest(to, token) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to,
        subject: "Password reset request",
        text: "You requested for a new password ?",
        html: `<div> 
                  <h1> A request to reset your password has been made ! </h1> 
                  <p> In order to reset your password, make sur to click this <a href="${WEBSITE_URL}/auth/password/${encodeURIComponent(
          token
        )}"> link </a></p>
               </div>
        `,
      })
    } catch (error) {
      console.log("Password reset request email not sent !")
    }
  }

  async sendPasswordResetConfirmation(to, first_name, date) {
    try {
      await this.transporter.sendMail({
        from: CREDENTIALS.APP_EMAIL,
        to,
        subject: " Security Warning !",
        text: " Security Warning !",
        html: `<div> <h1> Your password has been changed ! </h1> <p> Hi ${first_name}, your password has been changed on : ${new Date(
          date
        )} ! </p>  </div>`,
      })
    } catch (error) {
      console.log("Password reset confirmation email not sent ! ")
    }
  }
}

export default new EmailService()
