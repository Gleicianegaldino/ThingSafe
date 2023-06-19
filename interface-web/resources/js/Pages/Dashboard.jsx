import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import LargeTextBlock from '@/Components/LargeTextBlock';
import ThreeColumnData from '@/Components/ThreeColumnData';
import TwoColumnData from '@/Components/TwoColumnData';
import Footer from '@/Layouts/Footer';
import NavLink from '@/Components/NavLink';
import AlertLink from '@/Components/AlertLink';

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

    <AlertLink href={route('dailyevents')} active={route().current('dailyevents')}>
        <LargeTextBlock key={1} text="Daily Events" number={dailyAlertCount.toString()} backgroundColor="#DC143C" alertColumnValue={dailyAlertCount}/>,
    </AlertLink>,

    <AlertLink href={route('sectorslist')} active={route().current('sectorslist')}>
        <LargeTextBlock key={2} text="Sectors" number="1" backgroundColor="#F0F0F0" />,
    </AlertLink>

    ];
    const dataThreeColumn = [

    <AlertLink href={route('weeklyevents')} active={route().current('weeklyevents')}>
        <LargeTextBlock key={1} text="Weekly Events" number={weeklyAlertCount} backgroundColor="#F0F0F0" />,
    </AlertLink>,

    <AlertLink href={route('monthlyevents')} active={route().current('monthlyevents')}>
        <LargeTextBlock key={2} text="Monthly Events" number={monthlyAlertCount} backgroundColor="#F0F0F0" />,
    </AlertLink>, 

    <AlertLink href={route('annualevents')} active={route().current('annualevents')}>
        <LargeTextBlock key={3} text="Annual Events" number={annualAlertCount} backgroundColor="#F0F0F0" />,
    </AlertLink>

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
                        <div className="p-6 text-gray-900">
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

