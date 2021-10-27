import Link from "next/link"

export default function Hero({ user }) {
  return (
    <div className="bg-primary">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">
            Bienvenue sur EfreiBooks {user && user.first_name}.
          </span>
          <span className="block">
            La plateforme étudiante pour se cultiver.
          </span>
        </h2>

        {!user && (
          <>
            <p className="mt-4 text-lg leading-6 text-indigo-200">
              Vous êtes étudiant à l&apos;Efrei ? Empruntez vos livres sur la
              plateforme officiel de l&apos;école !
            </p>
            <Link href="/auth/register">
              <a className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-indigo-50 sm:w-auto">
                Inscrivez vous
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
