import { useEffect, useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Footer from '@/Layouts/Footer';
import EventList from '../Components/EventList';

export default function DailyEvents({ auth }) {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events/year');//passando a rota com o parametro de dia
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch daily events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daily Events</h2>}
      >
        <Head title="Daily Events" />
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-gray-900">
                <EventList events={events} />
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
      <Footer />
    </>
  );
}