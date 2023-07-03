import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Footer from '@/Layouts/Footer';
import ActiveSmartCone from '@/Layouts/ActiveSmartCone';

export default function MyCones({ auth }) {
    return (
        <><AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Cones</h2>}
        >
            <Head title="My Cones" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ActiveSmartCone className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout><Footer></Footer></>
    );
}
