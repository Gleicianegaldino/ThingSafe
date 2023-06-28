import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Footer from '@/Layouts/Footer';
import OperatorDashboard from './Permissions/OperatorDashboard';
import AdminDashboard from './Permissions/AdminDashboard';

export default function Dashboard({ auth }) {

    const [permissions, setPermissions] = useState([]);
    const [dailyAlertCount, setDailyAlertCount] = useState([]);
    const [weeklyAlertCount, setWeeklyAlertCount] = useState([]);
    const [monthlyAlertCount, setMonthlyAlertCount] = useState([]);
    const [annualAlertCount, setAnnualAlertCount] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const permissionsResponse = await axios.get('/api/permissions');
                setPermissions(permissionsResponse.data);

                const dailyAlertCountResponse = await axios.get('/api/dailyAlertCount');
                const { dailyCount } = dailyAlertCountResponse.data;
                setDailyAlertCount(dailyCount);

                const weeklyAlertCountResponse = await axios.get('/api/weeklyAlertCount');
                const { weeklyCount } = weeklyAlertCountResponse.data;
                setWeeklyAlertCount(weeklyCount);

                const monthlyAlertCountResponse = await axios.get('/api/monthlyAlertCount');
                const { monthlyCount } = monthlyAlertCountResponse.data;
                setMonthlyAlertCount(monthlyCount);

                const annualAlertCountResponse = await axios.get('/api/annualAlertCount');
                const { annualCount } = annualAlertCountResponse.data;
                setAnnualAlertCount(annualCount);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <><AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {permissions.some(permission => permission.permission_id === 1 && permission.model_id === auth.user.id) ? (
                                <AdminDashboard
                                    dailyAlertCount={dailyAlertCount}
                                    weeklyAlertCount={weeklyAlertCount}
                                    monthlyAlertCount={monthlyAlertCount}
                                    annualAlertCount={annualAlertCount}
                                />
                            ) : permissions.some(permission => permission.permission_id === 2 && permission.model_id === auth.user.id) ? (
                                <OperatorDashboard
                                    dailyAlertCount={dailyAlertCount}
                                    weeklyAlertCount={weeklyAlertCount}
                                    monthlyAlertCount={monthlyAlertCount}
                                    annualAlertCount={annualAlertCount}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout><Footer></Footer></>
    );
}

