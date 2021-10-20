import UserModel from "./User"
import AssetModel from "./Asset"
import AuthTokenModel from "./AuthToken"
import AccountConfirmationTokenModel from "./AccountConfirmationToken"
import PasswordResetTokenModel from "./PasswordResetToken"
import BookModel from "./Book"

export default (sequelize) => {
  const User = UserModel(sequelize)
  const Asset = AssetModel(sequelize)
  const AccountConfirmationToken = AccountConfirmationTokenModel(
    sequelize,
    User
  )
  const PasswordResetToken = PasswordResetTokenModel(sequelize, User)
  const AuthToken = AuthTokenModel(sequelize, User)
  const Book = BookModel(sequelize, User, Asset)

  return {
    User,
    Asset,
    AccountConfirmationToken,
    PasswordResetToken,
    AuthToken,
    Book,
  }
}
