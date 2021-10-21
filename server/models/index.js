import UserModel from "./User"
import UserPictureModel from "./UserPicture"
import AuthTokenModel from "./AuthToken"
import AccountConfirmationTokenModel from "./AccountConfirmationToken"
import PasswordResetTokenModel from "./PasswordResetToken"
import BookModel from "./Book"
import BookPictureModel from "./BookPicture"

export default (sequelize) => {
  const User = UserModel(sequelize)
  const UserPicture = UserPictureModel(sequelize, User)
  const AccountConfirmationToken = AccountConfirmationTokenModel(
    sequelize,
    User
  )
  const PasswordResetToken = PasswordResetTokenModel(sequelize, User)
  const AuthToken = AuthTokenModel(sequelize, User)
  const Book = BookModel(sequelize, User)
  const BookPicture = BookPictureModel(sequelize, Book)

  return {
    User,
    UserPicture,
    AccountConfirmationToken,
    PasswordResetToken,
    AuthToken,
    Book,
    BookPicture,
  }
}
