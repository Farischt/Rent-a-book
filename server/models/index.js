import UserModel from "./User"
import AuthTokenModel from "./AuthToken"
import AccountConfirmationTokenModel from "./AccountConfirmationToken"
import PasswordResetTokenModel from "./PasswordResetToken"

export default (sequelize) => {
  const User = UserModel(sequelize)
  const AccountConfirmationToken = AccountConfirmationTokenModel(
    sequelize,
    User
  )
  const PasswordResetToken = PasswordResetTokenModel(sequelize, User)
  const AuthToken = AuthTokenModel(sequelize, User)

  return {
    User,
    AuthToken,
    AccountConfirmationToken,
    PasswordResetToken,
  }
}
