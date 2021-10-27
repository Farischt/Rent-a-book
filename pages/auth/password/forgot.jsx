import { useState } from "react"
import Link from "next/link"
import Head from "next/head"

import AuthService from "@/services/AuthService"
import Loading from "@/components/Utils/Loading"
import ErrorMessage from "@/components/Shared/ErrorMessage"
import Notification from "@/components/Shared/Notification"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    if (error) setError("")
    if (success) setSuccess("")

    setEmail(event.target.value)
  }

  function handleError(error) {
    switch (error) {
      case "invalid_email":
        setError("Cet email n'est associé à aucun compte !")
        break
      case "already_sent":
        setError("Un email vous à déjà été envoyé !")
        break
      default:
        setError("Une erreur inconnue est survenu !")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthService.requestPassword(email)
      setSuccess("Votre demande est enregistré ! Un e-mail vous à été envoyé.")
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
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Head>
          <title>Efrei Books - Mot de passe oublié </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {success && <Notification message={success} />}
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Vous avez oublié votre mot de passe ?
            </h2>
          </div>
          <form
            className="mt-8 space-y-6"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Adresse mail"
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
                className="w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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

import { redirectAuthenticatedUser } from "@/lib/Auth"

export const getServerSideProps = async (context) => {
  return (await redirectAuthenticatedUser(context)) || { props: {} }
}
