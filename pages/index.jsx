import Head from "next/head"
import Layout from "@/components/Layout/Layout"

export default function Home() {
  return (
    <Layout title="Home page" user={null}>
      <Head>
        <title>Efrei Books - Accueil </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </Layout>
  )
}

import Database from "@/server/database"

export const getServerSideProps = async (context) => {
  const user = await Database.User.findOne()

  return {
    props: {
      user: user && {
        first_name: user.first_name,
      },
    },
  }
}
