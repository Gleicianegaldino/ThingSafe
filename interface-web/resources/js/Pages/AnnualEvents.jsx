import { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Footer from '@/Layouts/Footer';
import EventList from '../Components/EventList';
import { Oval } from 'react-loader-spinner';

export default function DailyEvents({ auth }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/events/year');
            setEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch daily events:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <>
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Annual Events</h2>}
            >
                <Head title="Daily Events" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <Oval
                                            height={80}
                                            width={80}
                                            color="#ffff00"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                            visible={true}
                                            ariaLabel='oval-loading'
                                            secondaryColor="#000000"
                                            strokeWidth={2}
                                            strokeWidthSecondary={2}

                                        />
                                    </div>
                                ) : events.length > 0 ? (
                                    <EventList events={events} />
                                ) : (
                                    <div className="text-center text-gray-500">Nenhuma invasão no ano</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            <Footer />
        </>
    );
}
