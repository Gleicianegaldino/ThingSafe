import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

const EventList = ({ events }) => {
  return (
    <div>
      {events.map((event, index) => (
        <div key={index}>
          <p>Setor: {event.setor}</p>
          <p>Responsável: {event.responsavel}</p>
          <p>Horário: {moment(event.created_at).format('HH:mm')}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default EventList;
