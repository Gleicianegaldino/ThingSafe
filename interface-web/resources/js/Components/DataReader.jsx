import React, { useState } from "react";

function DataReader(){

    // data (JSON)
    const data = {mac:'', status:'', topic:'', message:'', time:''}

    // useState
    const [saveData, setData] = useState(data);

    // event
    const event = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setData({...saveData, [name]:value});
    }

    return(
        <div>
            <p type='text' name='mac' onChange={event}> O MAC é:, {saveData.mac} </p>
            <p type='text' name='status' onChange={event}> O status é:, {saveData.status}</p>
            <p type='text' name='topic' onChange={event}> O topico é:, {saveData.topic}</p>
            <p type='text' name='message' onChange={event}> A mensagem é:, {saveData.message}</p>
            <p type='text' name='time' onChange={event}> O tempo é:, {saveData.time}</p>
        </div>
    )

}

export default DataReader;