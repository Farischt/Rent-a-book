import { useState } from "react"
import Link from "next/link"
import Head from "next/head"

import AuthService from "@/services/AuthService"
import Loading from "@/components/Utils/Loading"
import ErrorMessage from "@/components/Shared/ErrorMessage"
import Notification from "@/components/Shared/Notification"

export default function ResetPassword({ token }) {
  const [data, setData] = useState({
    resetToken: token && token.id,
    newPassword: "",
    repeatPassword: "",
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    if (error) setError("")
    if (success) setSuccess("")

    setData((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  function handleError(error) {
    switch (error) {
      case "password_lowercase_weakness":
        setError("Votre mot de passe doit contenir au moins une minuscule !")
        break
      case "password_uppercase_weakness":
        setError("Votre mot de passe doit contenir au moins une majuscule !")
        break
      case "password_number_weakness":
        setError("Votre mot de passe doit contenir au moins un chiffre !")
        break
      case "password_special_weakness":
        setError(
          "Votre mot de passe doit contenir au moins un caractère spécial !"
        )
        break
      case "expired_token":
        setError(
          "Votre session a expiré ! Veuillez faire une nouvelle demande."
        )
        break
      default:
        setError("Une erreur inconnue est survenu !")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthService.resetPassword(data)
      setSuccess(
        "Votre mot de passe a été modifié ! Un e-mail vous à été envoyé."
      )
      setLoading(false)
    } catch (err) {
      if (err.response.data.error) {
        handleError(err.response.data.error)
      } else {
        setError("Une erreur inconnue est survenu !")
      }
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Efrei Books - Réinitialisation de votre mot de passe </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {success && <Notification message={success} />}
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Réinitialisez votre mot de passe
            </h2>
          </div>
          <form
            className="mt-8 space-y-6"
            method="PATCH"
            onSubmit={handleSubmit}
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  value={token.email}
                  readOnly
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-0 focus:border-1 focus:border-gray-300  focus:z-10 sm:text-sm"
                  placeholder="Adresse mail"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Email address
                </label>
                <input
                  id="password"
                  type="password"
                  name="newPassword"
                  value={data.newPassword}
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                />
              </div>

              <div>
                <label htmlFor="repeatPassword" className="sr-only">
                  Email address
                </label>
                <input
                  id="repeatPassword"
                  type="password"
                  name="repeatPassword"
                  value={data.repeatPassword}
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Repétez votre mot de passe !"
                />
              </div>
            </div>

            {error && <ErrorMessage error={error} />}

            <div className="flex items-center justify-between">
              <Link href="/">
                <a className="w-1/3 flex justify-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Retour
                </a>
              </Link>

              <button
                type="submit"
                disabled={
                  loading ||
                  data.newPassword !== data.repeatPassword ||
                  data.newPassword.length < 8
                }
                className="w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? <Loading showText /> : "Envoyer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

import { redirectAuthenticatedUser, checkPasswordResetToken } from "@/lib/Auth"

export const getServerSideProps = async (context) => {
  return (
    (await redirectAuthenticatedUser(context)) ||
    (await checkPasswordResetToken(context))
  )
}
