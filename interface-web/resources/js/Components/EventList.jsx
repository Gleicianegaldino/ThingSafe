import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

const EventList = ({ events }) => {
  return (
    <table className="border rounded-lg w-full">
      <thead className="bg-gray-200">
        <tr>
          <th className="border px-4 py-2">Setor</th>
          <th className="border px-4 py-2">Responsável</th>
          <th className="border px-4 py-2">Horário</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
            <td className="border px-4 py-2">{event.setor}</td>
            <td className="border px-4 py-2">{event.responsavel}</td>
            <td className="border px-4 py-2">{moment(event.created_at).format('HH:mm:ss')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EventList;
