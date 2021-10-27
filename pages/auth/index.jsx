import { useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Link from "next/link"

import AuthService from "@/services/AuthService"
import ErrorMessage from "@/components/Shared/ErrorMessage"
import Loading from "@/components/Utils/Loading"

export default function Login() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleCredentialsChange(event) {
    if (error) setError("")

    setCredentials((state) => ({
      ...state,
      [event.target.name]: event.target.value,
    }))
  }

  function handleError(error) {
    switch (error) {
      case "invalid_credentials":
        setError("Identifiants incorrects !")
        break
      default:
        setError("Une erreur inconnue est survenu !")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      await AuthService.login(credentials)
      setLoading(false)
      router.push("/")
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
        <title>Efrei Books - Connexion </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Connectez-vous !
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
                      required
                      value={credentials.email}
                      onChange={handleCredentialsChange}
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
                      value={credentials.password}
                      onChange={handleCredentialsChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link href="/auth/register">
                      <a className="font-small text-gray-500 hover:text-gray-700">
                        Toujours pas inscrit ?
                      </a>
                    </Link>
                  </div>

                  <div className="text-sm">
                    <Link href="/auth/password/forgot">
                      <a className="font-medium text-primary hover:text-primary-dark">
                        Mot de passe oublié ?
                      </a>
                    </Link>
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
                    disabled={loading}
                    className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    {loading ? <Loading showText /> : "Se connecter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/login.png"
          alt=""
        />
      </div>
    </div>
  )
}

import { redirectAuthenticatedUser } from "@/lib/Auth"

export const getServerSideProps = async (context) => {
  return (await redirectAuthenticatedUser(context)) || { props: {} }
}
