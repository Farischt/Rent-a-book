import { DataTypes, Model, Op } from "sequelize"
import Database from "@/server/database"
import slugify from "slugify"

class Book extends Model {
  setSlug() {
    this.slug = slugify(this.title, { lower: true })
  }

  async getPicture() {
    return await Database.BookPicture.findOne({
      where: { book_id: this.id },
    })
  }

  static async isConflict(title) {
    return title &&
      (await Book.findOne({
        where: {
          [Op.or]: [{ title }, { slug: slugify(title, { lower: true }) }],
        },
      }))
      ? true
      : false
  }

  static async getBySlug(slug) {
    return (
      slug &&
      (await Book.findOne({
        where: { slug },
      }))
    )
  }

  static async getAvailableBooks() {
    return await Book.findAll({
      where: { user_id: null },
    })
  }
}

export default (sequelize, User) =>
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: User,
          key: "id",
        },
      },
    },
    { sequelize, modelName: "Book" }
  )
