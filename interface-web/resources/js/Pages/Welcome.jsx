import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="max-w-7xl mx-auto p-6 lg:p-8">

                    <div className="flex justify-center">
                        <svg width="100" height="100" viewBox="0 0 171 171" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M73.875 33.8438V123.75H4.5V4.5H166.5V29.3438H78.375H73.875V33.8438Z" stroke="white" stroke-width="9" />
                            <path d="M97.125 137.156V47.25H166.5V166.5H4.5V141.656H92.625H97.125V137.156Z" stroke="white" stroke-width="9" />
                            <rect x="35.625" y="42.75" width="7.125" height="42.75" fill="white" />
                            <ellipse cx="85.5" cy="85.5" rx="17.8125" ry="21.375" fill="white" />
                            <rect x="128.25" y="85.5" width="7.125" height="42.75" fill="white" />
                            <rect x="114" y="92.625" width="7.125" height="35.625" transform="rotate(-90 114 92.625)" fill="white" />
                        </svg>

                    </div>

                    <div className="flex justify-center mt-16 px-6 sm:items-center sm:justify-between">
                        <div className="ml-4 text-center text-sm text-gray-500 dark:text-gray-400 sm:text-right sm:ml-0">
                            © 2023 ThingSafe. Todos os direitos reservados.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
