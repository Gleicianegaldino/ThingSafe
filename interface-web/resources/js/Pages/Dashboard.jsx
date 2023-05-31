import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

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
                    <p>Manager</p>
                </div>
            )
        } else if (permissionIds.includes(3)) {
            return (
                <div>
                    <p>Operator</p>
                </div>
            )
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">You're logged in!</div>
                        <div class="p-6 bg-white border-b border-gray-200">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

