import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LargeTextBlock from '@/Components/LargeTextBlock';
import ThreeColumnData from '@/Components/ThreeColumnData';
import TwoColumnData from '@/Components/TwoColumnData';
import Footer from '@/Layouts/Footer';

export default function Dashboard({ auth }) {

    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        axios.get('/api/permissions')
            .then(response => {
                setPermissions(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch permissions:', error);
            });
    }, []);

    const renderContent = () => {

        const permissionIds = permissions.map(permission => permission.permission_id);

        if (permissionIds.includes(1)) {
            return (
                <div>
                    <p>Admin</p>
                </div>
            )
        } else if (permissionIds.includes(2)) {
            return (
                <div>
                    <p>Operator</p>
                </div>
            )
        }
    };

    const dataTwoColumn = [
        <LargeTextBlock key={1} text="Daily Events" number="1" backgroundColor="#DC143C" />,
        <LargeTextBlock key={2} text="Sectors" number="1" backgroundColor="#F4A460" />,
    ];
    const dataThreeColumn = [
        <LargeTextBlock key={1} text="Weekly Events" number="1" backgroundColor="#FFA500" />,
        <LargeTextBlock key={2} text="Monthly Events" number="1" backgroundColor="#32CD32" />,
        <LargeTextBlock key={3} text="Annual Events" number="1" backgroundColor="#20B2AA" />,
    ];

    return (
        <><AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!
                            {renderContent()}
                            <TwoColumnData data={dataTwoColumn} />
                            <ThreeColumnData data={dataThreeColumn} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout><Footer></Footer></>
    );
}

