import Head from "next/head"

import Layout from "@/components/Layout/Layout"
import Hero from "@/components/Pages/Home/Hero"
import BookList from "@/components/Pages/Home/BookList"
import Founders from "@/components/Pages/Home/Founders"

export default function Home({ user, books }) {
  return (
    <Layout title="Home page" user={user}>
      <Head>
        <title>Efrei Books - Accueil </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero user={user} />
      <BookList books={books} />
      <Founders />
    </Layout>
  )
}

import Backend from "@/server/index"
import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)
  const latestBooks = await Promise.all(
    (
      await Database.Book.findAll()
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
