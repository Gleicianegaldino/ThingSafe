import React from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

const EventList = ({ events }) => {
  const eventCardStyle = {
    border: '1px solid black',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '10px',
  };


  return (
    <div>
      {events.map((event, index) => (
        <div key={index} style={eventCardStyle}>
          <p>Setor: {event.setor}</p>
          <p>Responsável: {event.responsavel}</p>
          <p>Horário: {moment(event.created_at).format('HH:mm:ss')}</p>
          
        </div>
      ))}
    </div>
  );
};

export default EventList;
