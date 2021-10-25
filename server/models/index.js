import UserModel from "./User"
import UserPictureModel from "./UserPicture"
import AuthTokenModel from "./AuthToken"
import AccountConfirmationTokenModel from "./AccountConfirmationToken"
import PasswordResetTokenModel from "./PasswordResetToken"
import BookModel from "./Book"
import BookPictureModel from "./BookPicture"
import LoanModel from "./Loan"

export default (sequelize) => {
  const User = UserModel(sequelize)
  const Book = BookModel(sequelize)
  const UserPicture = UserPictureModel(sequelize, User)
  const AccountConfirmationToken = AccountConfirmationTokenModel(
    sequelize,
    User
  )
  const PasswordResetToken = PasswordResetTokenModel(sequelize, User)
  const AuthToken = AuthTokenModel(sequelize, User)
  const BookPicture = BookPictureModel(sequelize, Book)
  const Loan = LoanModel(sequelize, User, Book)

  return {
    User,
    Book,
    UserPicture,
    AccountConfirmationToken,
    PasswordResetToken,
    AuthToken,
    BookPicture,
    Loan,
  }
}
