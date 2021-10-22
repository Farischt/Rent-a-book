import Head from "next/head"
import { ExternalLinkIcon } from "@heroicons/react/solid"

import Layout from "@/components/Layout/Layout"
import Hero from "@/components/Pages/Home/Hero"
import Founders from "@/components/Pages/Home/Founders"

import AssetService from "@/services/AssetService"

export default function Home({ user, books }) {
  return (
    <Layout title="Home page" user={user}>
      <Head>
        <title>Efrei Books - Accueil </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero user={user} />
      <Founders />
      <div className="relative bg-gray-800">
        <div className="h-56 bg-indigo-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&blend=6366F1&sat=-100&blend-mode=multiply"
            alt=""
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="md:ml-auto md:w-1/2 md:pl-10">
            <h2 className="text-base font-semibold uppercase tracking-wider text-gray-300">
              Award winning support
            </h2>
            <p className="mt-2 text-white text-3xl font-extrabold tracking-tight sm:text-4xl">
              We’re here to help
            </p>
            <p className="mt-3 text-lg text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
              egestas tempus tellus etiam sed. Quam a scelerisque amet
              ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
              quisque ut interdum tincidunt duis.
            </p>
            <div className="mt-8">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50"
                >
                  Visit the help center
                  <ExternalLinkIcon
                    className="-mr-1 ml-3 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)
  const latestBooks = await Promise.all(
    (
      await Database.Book.getAvailableBooks()
    ).map(async (book) => {
      return {
        id: book.id,
        title: book.title,
        slug: book.slug,
        author: book.author,
        content: book.content,
        picture: await book.getPicture(),
      }
    })
  )

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

      books:
        latestBooks.length &&
        latestBooks.map((book) => ({
          id: book.id,
          title: book.title,
          slug: book.slug,
          author: book.author,
          content: book.content,
          picture_id: book.picture.id,
        })),
    },
  }
}
