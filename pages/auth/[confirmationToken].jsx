import Link from "next/link"
import { CheckIcon } from "@heroicons/react/outline"

export default function ConfirmAccount({ first_name, email }) {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Votre inscription est terminée !
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {first_name}, votre compte est maintenant activé ! Vous
                    pouvez dès à présent vous connectez avec votre email {email}{" "}
                    , ainsi que votre mot de passe !
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <Link href="/auth">
                <a className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                  Connexion
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { redirectAuthenticatedUser, confirmUserAccount } from "@/lib/Auth"

export const getServerSideProps = async (context) => {
  return (
    (await redirectAuthenticatedUser(context)) ||
    (await confirmUserAccount(context))
  )
}
