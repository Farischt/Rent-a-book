import { Sequelize, Model, DataTypes } from "sequelize"

class UserPicture extends Model {}

export default (sequelize, User) =>
  UserPicture.init(
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "UserPicture",
    }
  )
