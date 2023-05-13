<!DOCTYPE html>
<html>
<head>
    <title>Dispositivos</title>
</head>
<body>
    <h1>Dispositivos</h1>
    <table>
        <thead>
            <tr>
                <th>Tópico</th>
                <th>Mensagem</th>
                <th>QoS</th>
            </tr>
        </thead>
        <tbody>
            @foreach($dispositivos as $dispositivo)
                <tr>
                    <td>{{ $dispositivo->topico }}</td>
                    <td>{{ $dispositivo->mensagem }}</td>
                    <td>{{ $dispositivo->qos }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
