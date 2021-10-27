import { Sequelize, DataTypes, Model } from "sequelize"
import Database from "@/server/database"

class Loan extends Model {
  async getEquivalentBook() {
    return await Database.Book.findOne({
      where: {
        id: this.book_id,
      },
    })
  }
}

export default (sequelize, User, Book) =>
  Loan.init(
    {
      user_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: User,
          key: "id",
        },
      },

      book_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: Book,
          key: "id",
        },
      },

      loan_date: {
        primaryKey: true,
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now(),
      },

      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now() + 7 * 86400000,
      },

      deposit_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "Loan",
    }
  )
