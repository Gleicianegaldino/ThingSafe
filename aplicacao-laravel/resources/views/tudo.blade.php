

<!DOCTYPE html>
<head>
    <title>Dispositivos-todos-eles</title>
</head>
<body>
    <div class="container">
        
        <h1>Dispositivos</h1>
        <table class="table">
            <thead>
                <tr>
                    <th>Tópico</th>
                    <th>Mensagem</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($dispositivos as $dispositivo)
                    <tr>
                        <td>{{ $dispositivo->topico }}</td>
                        <td>{{ $dispositivo->mensagem }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
