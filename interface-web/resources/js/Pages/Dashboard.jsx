import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import Footer from '@/Layouts/Footer';
import OperatorDashboard from './Permissions/OperatorDashboard';
import AdminDashboard from './Permissions/AdminDashboard';
import axios from 'axios';

export default function Dashboard({ auth }) {

    const [permissions, setPermissions] = useState([]);
    const [dailyAlertCount, setDailyAlertCount] = useState([]);
    const [weeklyAlertCount, setWeeklyAlertCount] = useState([]);
    const [monthlyAlertCount, setMonthlyAlertCount] = useState([]);
    const [annualAlertCount, setAnnualAlertCount] = useState([]);
    const [sectorCount, setSectorCount] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const permissionsResponse = await axios.get('/api/permissions');
                setPermissions(permissionsResponse.data);

                const dailyAlertCountResponse = await axios.get('/events/total/day');
                setDailyAlertCount(dailyAlertCountResponse.data.totalEvents);

                const sumSectors = await axios.get('/api/sumSectors');
                setSectorCount(sumSectors.data.sectorCount);

                const weeklyAlertCountResponse = await axios.get('/events/total/week');
                setWeeklyAlertCount(weeklyAlertCountResponse.data.totalEvents);

                const monthlyAlertCountResponse = await axios.get('/events/total/month');
                setMonthlyAlertCount(monthlyAlertCountResponse.data.totalEvents);

                const annualAlertCountResponse = await axios.get('/events/total/year');
                setAnnualAlertCount(annualAlertCountResponse.data.totalEvents);
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
                                    sectorCount = {sectorCount}
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

