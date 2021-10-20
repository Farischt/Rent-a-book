import Backend from "@/server/index"
import Database from "@/server/database"

function isUUID(id) {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
  return regexExp.test(id)
}

function redirect(destination, permanent) {
  return {
    redirect: {
      destination,
      permanent,
    },
  }
}

export const getAuthenticatedUser = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)

  return {
    props: {
      user: user && {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        verified: user.verified,
        admin: user.admin,
      },
    },
  }
}

export const redirectAuthenticatedUser = async (context) => {
  if (await Backend.getAuthenticatedUser(context)) {
    return redirect("/", false)
  }
}

export const redirectUnauthenticatedUser = async (context) => {
  if (!(await Backend.getAuthenticatedUser(context))) {
    return redirect("/", false)
  }
}

export const confirmUserAccount = async (context) => {
  const { confirmationToken } = context.params

  const validToken =
    confirmationToken &&
    isUUID(confirmationToken) &&
    (await Database.AccountConfirmationToken.findByPk(confirmationToken))

  if (!validToken) return redirect("/", false)

  const user = await Database.User.get(validToken.user_id)

  if (!user || user.verified) return redirect("/", false)

  user.verified = true
  await user.save()
  await validToken.destroy()

  return {
    props: {
      email: user.email,
      first_name: user.first_name,
    },
  }
}

export const checkPasswordResetToken = async (context) => {
  const token =
    context.params.token &&
    isUUID(context.params.token) &&
    (await Database.PasswordResetToken.findByPk(context.params.token))

  if (!token) return redirect("/", false)
  else if (token.createdAt < Date.now() - 60 * 60 * 1000) {
    await token.destroy()
    return redirect("/", false)
  }

  const user = await token.getUser()
  if (!user) return redirect("/", false)

  return {
    props: {
      token: {
        id: token.token,
        email: user.email,
      },
    },
  }
}
