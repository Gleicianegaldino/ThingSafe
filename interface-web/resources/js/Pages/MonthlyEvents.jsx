import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Footer from '@/Layouts/Footer';
import MonthlyComp from '../Components/MonthlyComp';

export default function MonthlyEvents({ auth }) {
    return (
        <><AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Monthly Events</h2>}
        >
        <Head title="Monthly Events" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {
                                <MonthlyComp/>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout><Footer></Footer></>
    );
}