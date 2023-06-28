import React from 'react';
import LargeTextBlock from '@/Components/LargeTextBlock';
import ThreeColumnData from '@/Components/ThreeColumnData';
import AlertLink from '@/Components/AlertLink';

const OperatorDashboard = ({ dailyAlertCount, weeklyAlertCount, monthlyAlertCount, annualAlertCount }) => {

    const dataThreeColumnOperator = [
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
            <p>Operator</p>
            <AlertLink href={route('dailyevents')} active={route().current('dailyevents')}>
                <LargeTextBlock key={1} text="Daily Events" number={dailyAlertCount.toString()} backgroundColor="#DC143C" alertColumnValue={dailyAlertCount} />
            </AlertLink>,
            <ThreeColumnData data={dataThreeColumnOperator} />
        </div>
    );
};

export default OperatorDashboard;
