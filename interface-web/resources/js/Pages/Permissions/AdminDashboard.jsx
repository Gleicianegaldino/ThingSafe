import React from 'react';
import LargeTextBlock from '@/Components/LargeTextBlock';
import ThreeColumnData from '@/Components/ThreeColumnData';
import TwoColumnData from '@/Components/TwoColumnData';
import AlertLink from '@/Components/AlertLink';

const AdminDashboard = ({ dailyAlertCount, weeklyAlertCount, monthlyAlertCount, annualAlertCount }) => {
    const dataTwoColumnAdmin = [
        <AlertLink href={route('dailyevents')} active={route().current('dailyevents')}>
            <LargeTextBlock key={1} text="Daily Events" number={dailyAlertCount.toString()} backgroundColor="#DC143C" alertColumnValue={dailyAlertCount} />
        </AlertLink>,
        <AlertLink href={route('registersectors')} active={route().current('registersectors')}>
            <LargeTextBlock key={2} text="Sectors" number="1" backgroundColor="#BDB76B" />
        </AlertLink>
    ];

    const dataThreeColumnAdmin = [
        <AlertLink href={route('weeklyevents')} active={route().current('weeklyevents')}>
            <LargeTextBlock key={1} text="Weekly Events" number={weeklyAlertCount} backgroundColor="#F0F0F0" />
        </AlertLink>,
        <AlertLink href={route('monthlyevents')} active={route().current('monthlyevents')}>
            <LargeTextBlock key={2} text="Monthly Events" number={monthlyAlertCount} backgroundColor="#F0F0F0" />
        </AlertLink>,
        <AlertLink href={route('annualevents')} active={route().current('annualevents')}>
            <LargeTextBlock key={3} text="Annual Events" number={annualAlertCount} backgroundColor="#F0F0F0" />
        </AlertLink>
    ];

    return (
        <div>
            <p>Admin</p>
            <TwoColumnData data={dataTwoColumnAdmin} />
            <ThreeColumnData data={dataThreeColumnAdmin} />
        </div>
    );
};

export default AdminDashboard;
