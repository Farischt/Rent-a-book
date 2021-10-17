import Backend from "@/server/index"
import Database from "@/server/database"
import EmailService from "@/server/mails/index"
import { Op } from "sequelize"

class AuthController {
  //! Logs in a user
  async login(req, res) {
    if (await Backend.getAuthenticatedUser({ req, res })) {
      res.statusCode = 403
      return res.json({ error: "already_logged_in" })
    } else if (typeof req.body.email !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_email" })
    } else if (typeof req.body.password !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_password" })
    }

    try {
      const user = await Database.User.findOne({
        where: { email: req.body.email.trim() },
      })

      if (!user) {
        res.statusCode = 401
        return res.json({ error: "invalid_credentials" })
      } else if (!(await user.checkPassword(req.body.password))) {
        res.statusCode = 401
        return res.json({ error: "invalid_credentials" })
      } else if (!user.verified) {
        res.statusCode = 401
        return res.json({ error: "invalid_credentials" })
      }

      const token = await Database.AuthToken.create({
        user_id: user.id,
      })

      await Backend.login({ req, res }, token.token)

      res.statusCode = 200
      res.json({
        loggedIn: true,
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      })
    } catch (error) {
      res.statusCode = 500
      res.json({ error: "internal_server_error" })
    }
  }

  //! Registers a user
  async register(req, res) {
    if (typeof req.body.email !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_email" })
    } else if (typeof req.body.first_name !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_first_name" })
    } else if (typeof req.body.last_name !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_last_name" })
    } else if (typeof req.body.password !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_password" })
    } else if (typeof req.body.repeatPassword !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_repeat_password" })
    }

    const email = req.body.email.trim()

    if (await Database.User.emailTaken(email)) {
      res.statusCode = 400
      return res.json({ error: "email_taken" })
    }

    //? Password strength

    if (req.body.password !== req.body.repeatPassword) {
      res.statusCode = 400
      return res.json({ error: "passwords_are_not_the_same" })
    } else if (req.body.password.length < 8) {
      res.statusCode = 400
      return res.json({ error: "password_too_short" })
    } else if (!req.body.password.match(/[a-z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_lowercase_weakness" })
    } else if (!req.body.password.match(/[A-Z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_uppercase_weakness" })
    } else if (!req.body.password.match(/[0-9]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_number_weakness" })
    } else if (!req.body.password.match(/[^0-9a-zA-Z\s]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_special_weakness" })
    }

    const { first_name, last_name, password } = req.body
    const user = Database.User.build({
      first_name,
      last_name,
      email,
    })

    await user.setPassword(password)
    await user.save()

    const token = await Database.AccountConfirmationToken.create({
      user_id: user.id,
    })

    await EmailService.sendAccountConfirmationMail(
      user.email,
      user.first_name,
      token.token
    )

    res.statusCode = 200
    res.json({ success: true })
  }

  //! Logs out a user
  async logout(req, res) {
    if (!(await Backend.getAuthenticatedUser({ req, res }))) {
      res.statusCode = 401
      return res.json({ error: "not_authenticated" })
    }

    await Backend.logout({ req, res })
    res.statusCode = 200
    res.json({ success: true })
  }

  //! Asks for a new password
  async passwordRequest(req, res) {
    if (typeof req.body.email !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_email" })
    }

    const user = await Database.User.findOne({
      where: { email: req.body.email.trim() },
    })
    if (!user) {
      res.statusCode = 400
      return res.json({ error: "invalid_email" })
    } else if (!user.verified) {
      res.statusCode = 400
      return res.json({ error: "invalid_email" })
    }

    const token = await Database.PasswordResetToken.findOne({
      where: {
        user_id: user.id,
        createdAt: {
          [Op.gte]: Date.now() - 60 * 1000,
        },
      },
    })

    if (token) {
      res.statusCode = 400
      return res.json({ error: "already_sent" })
    }

    //! We make sure to destroy previous password reset token
    await Database.PasswordResetToken.destroy({
      where: {
        user_id: user.id,
      },
    })

    const newToken = await Database.PasswordResetToken.create({
      user_id: user.id,
    })

    await EmailService.sendPasswordResetRequest(user.email, newToken.token)

    res.statusCode = 200
    res.json({ succes: true })
  }

  //! Creates a new password
  async passwordConfirm(req, res) {
    if (typeof req.body.resetToken !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_token" })
    } else if (typeof req.body.newPassword !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_password" })
    } else if (typeof req.body.repeatPassword !== "string") {
      res.statusCode = 400
      return res.json({ error: "missing_repeat" })
    }

    //? Password strength

    if (req.body.newPassword !== req.body.repeatPassword) {
      res.statusCode = 400
      return res.json({ error: "passwords_are_not_the_same" })
    } else if (req.body.newPassword.length < 8) {
      res.statusCode = 400
      return res.json({ error: "password_too_short" })
    } else if (!req.body.newPassword.match(/[a-z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_lowercase_weakness" })
    } else if (!req.body.newPassword.match(/[A-Z]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_uppercase_weakness" })
    } else if (!req.body.newPassword.match(/[0-9]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_number_weakness" })
    } else if (!req.body.newPassword.match(/[^0-9a-zA-Z\s]/g)) {
      res.statusCode = 400
      return res.json({ error: "password_special_weakness" })
    }

    const token = await Database.PasswordResetToken.findByPk(
      req.body.resetToken
    )

    if (!token) {
      res.statusCode = 400
      return res.json({ error: "invalid_token" })
    } else if (token.createdAt < Date.now() - 60 * 60 * 1000) {
      res.statusCode = 400
      return res.json({ error: "expired_token" })
    }

    const user = await token.getUser()
    await user.setPassword(req.body.newPassword)
    await user.save()
    await token.destroy()

    await EmailService.sendPasswordResetConfirmation(
      user.email,
      user.first_name,
      user.updatedAt
    )

    res.statusCode = 200
    res.json({
      succes: true,
    })
  }
}

export default new AuthController()
