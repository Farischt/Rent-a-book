import { Sequelize, Model, DataTypes } from "sequelize"

class BookPicture extends Model {}

export default (sequelize, Book) =>
  BookPicture.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mime_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.BLOB,
        allowNull: false,
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: Book,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "BookPicture",
    }
  )
