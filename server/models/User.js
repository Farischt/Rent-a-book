import { DataTypes, Model } from "sequelize"
import Database from "@/server/database"
import bcryptjs from "bcryptjs"

const SALT_ROUND = 10

class User extends Model {
  static async get(id) {
    return id && (await User.findByPk(id))
  }

  static async emailTaken(email) {
    return email && (await User.findOne({ where: { email } })) ? true : false
  }

  async checkPassword(password) {
    return (
      password &&
      this.password !== null &&
      (await bcryptjs.compare(password, this.password))
    )
  }

  async setPassword(password) {
    this.password =
      password !== null && password !== undefined
        ? await bcryptjs.hash(password, SALT_ROUND)
        : null
  }

  async getProfilePicture() {
    return await Database.UserPicture.findOne({
      where: { user_id: this.id },
    })
  }

  async isBookMine(bookId) {
    const mine = await Database.Loan.findOne({
      where: {
        book_id: bookId,
        user_id: this.id,
        deposit_date: null,
      },
    })

    return mine ? true : false
  }

  async getMyLoans() {
    return await Database.Loan.findAll({
      where: {
        user_id: this.id,
        deposit_date: null,
      },
    })
  }
}

export default (sequelize) =>
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  )
