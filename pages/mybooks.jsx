import Layout from "@/components/Layout/Layout"

export default function MyBooks({ user, books }) {
  return (
    <Layout user={user}>
      {books && books.length ? (
        <p> Vos livres </p>
      ) : (
        <p> Vous n'avez pas encore de livre ! </p>
      )}
    </Layout>
  )
}

import Backend from "@/server/index"

export const getServerSideProps = async (context) => {
  const user = await Backend.getAuthenticatedUser(context)
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        perfanent: false,
      },
    }
  }

  const books = await Promise.all(
    (
      await user.getMyLoans()
    ).map(async (loan) => {
      const book = await loan.getEquivalentBook()
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
        books.length &&
        books.map((book) => ({
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
