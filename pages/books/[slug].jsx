import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import Layout from "@/components/Layout/Layout"
import Loading from "@/components/Utils/Loading"

import AssetService from "@/services/AssetService"
import BookService from "@/services/BookService"

export default function Slug({ user, book }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function handleBorrow() {
    setLoading(true)
    try {
      await BookService.borrow(book.slug)
      setLoading(false)
      setSuccess("Merci pour votre emprunt !")
      router.replace(router.asPath)
    } catch (error) {
      setLoading(false)
      setError("Impossible d'emprunter ce livre pour le moment !")
    }
  }

  async function handleReturn() {
    setLoading(true)
    try {
      await BookService.return(book.slug)
      setLoading(false)
      setSuccess("Merci pour votre retour !")
      router.replace(router.asPath)
    } catch (error) {
      setLoading(false)
      setError("Impossible de retourner ce livre pour le moment !")
    }
  }

  return (
    <Layout user={user}>
      <div className="bg-white">
        <section aria-labelledby="features-heading" className="relative">
          <div className="aspect-w-3 aspect-h-2 overflow-hidden sm:aspect-w-5 lg:aspect-none lg:absolute lg:w-1/2 lg:h-full lg:pr-4 xl:pr-16">
            <img
              src={AssetService.getEncodedBookPicture(book.picture_id)}
              alt="Black leather journal with silver steel disc binding resting on wooden shelf with machined steel pen."
              className="h-full w-full object-center object-cover lg:h-full lg:w-full"
            />
          </div>

          <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:pb-32 sm:px-6 lg:max-w-7xl lg:pt-32 lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="lg:col-start-2">
              <h2 id="features-heading" className="font-medium text-gray-500">
                by {book.author}
              </h2>
              <p className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight">
                {book.title}
              </p>
              <p className="mt-4 text-gray-500">{book.content}</p>
              <div className="mt-8 flex justify-center">
                {book.available ? (
                  user ? (
                    <button
                      type="button"
                      onClick={handleBorrow}
                      disabled={loading}
                      className="w-48 flex justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {loading ? <Loading /> : "Emprunter"}
                    </button>
                  ) : (
                    <Link href="/auth">
                      <a
                        type="button"
                        className="w-48 flex justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        Connexion
                      </a>
                    </Link>
                  )
                ) : user ? (
                  book.isMine ? (
                    <button
                      type="button"
                      onClick={handleReturn}
                      disabled={loading}
                      className="w-48 flex justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-danger hover:bg-danger focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger disabled:opacity-50"
                    >
                      {loading ? <Loading /> : "Retourner"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-48 flex justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      Indisponible
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-48 flex justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Indisponible
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)
  const book = await Database.Book.getBySlug(context.params.slug)
  if (!book) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const picture = await book.getPicture()
  const available = await book.isAvailable()
  const mine = user && !available && (await user.isBookMine(book.id))

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

      book: book && {
        id: book.id,
        title: book.title,
        slug: book.slug,
        author: book.author,
        content: book.content,
        picture_id: picture && picture.id,
        available: available,
        isMine: mine,
      },
    },
  }
}
