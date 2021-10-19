import Backend from "@/server/index"
import Database from "@/server/database"

class Redirect {
  async redirectAuthenticatedUser(context) {
    if (await Backend.getAuthenticatedUser(context)) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }
  }

  async redirectUnauthenticatedUser(context) {
    if (!(await Backend.getAuthenticatedUser(context))) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }
  }

  //   static redirectUnverifiedUser(user) {
  //     if (!user || user.verified) {
  //       return {
  //         redirect: {
  //           destination: "/",
  //           permanent: false,
  //         },
  //       }
  //     }
  //   }

  static isUUID(id) {
    const regexExp =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
    return regexExp.test(id)
  }

  async confirmUserAccount(context) {
    const { confirmationToken } = context.params

    const validToken =
      confirmationToken &&
      Redirect.isUUID(confirmationToken) &&
      (await Database.AccountConfirmationToken.findByPk(confirmationToken))

    if (!validToken) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }

    const user = await Database.User.get(validToken.user_id)

    if (!user || user.verified) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      }
    }
    // Redirect.redirectUnverifiedUser(user)

    user.verified = true
    await user.save()
    // await validToken.destroy()

    return {
      props: {
        email: user.email,
        first_name: user.first_name,
      },
    }
  }
}

export default new Redirect()
