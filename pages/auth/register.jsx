import { useState } from "react"
import Head from "next/head"
import Link from "next/link"

import AuthService from "@/services/AuthService"
import ErrorMessage from "@/components/Shared/ErrorMessage"
import Notification from "@/components/Shared/Notification"
import Loading from "@/components/Utils/Loading"

export default function Register() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeatPassword: "",
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    if (error) setError("")
    setUser((state) => ({ ...state, [event.target.name]: event.target.value }))
  }

  function handleError(error) {
    switch (error) {
      case "email_taken":
        setError("Cet email est déjà utilisé !")
        break
      case "password_too_short":
        setError("Votre mot de passe doit contenir au moins 8 caractères !")
        break
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
      default:
        setError("Une erreur inconnue est survenu !")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthService.register(user)
      setLoading(false)
      // router.push("/auth")
      setSuccess(
        "Votre inscription est complète ! Un e-mail vous à été envoyé."
      )
    } catch (error) {
      if (error.response.data.error) {
        handleError(error.response.data.error)
      } else {
        setError("Une erreur inconnue est survenu !")
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Head>
        <title>Efrei Books - Inscription </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {success && <Notification message={success} />}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/register.png"
          alt=""
        />
      </div>
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Inscrivez-vous !
            </h2>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form method="POST" className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adresse mail
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Prénom
                  </label>
                  <div className="mt-1">
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      autoComplete="first_name"
                      required
                      value={user.first_name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom
                  </label>
                  <div className="mt-1">
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      autoComplete="last_name"
                      required
                      value={user.last_name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={user.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="repeatPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Répétez votre mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="repeatPassword"
                      name="repeatPassword"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={user.repeatPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-sm">
                    <Link href="/auth/">
                      <a className="font-medium text-primary hover:text-primary-dark">
                        Déjà inscrit ?
                      </a>
                    </Link>
                  </div>
                </div>

                {/* <div className="flex items-center justify-center">
                  {error && <p className="font-small text-danger"> {error} </p>}
                </div> */}
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
                      user.password !== user.repeatPassword ||
                      user.password.length < 8
                    }
                    className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {loading ? <Loading showText /> : "S'inscrire"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { redirectAuthenticatedUser } from "@/lib/Auth"

export const getServerSideProps = async (context) => {
  return (await redirectAuthenticatedUser(context)) || { props: {} }
}
