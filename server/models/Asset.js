import { Sequelize, Model, DataTypes } from "sequelize"

class Asset extends Model {
  static async getByType(mime_type) {
    return mime_type && (await Asset.findAll({ where: { mime_type } }))
  }
}

export default (sequelize) =>
  Asset.init(
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
    },
    {
      sequelize,
      modelName: "Asset",
    }
  )
