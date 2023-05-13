@extends('layouts.app')

@section('content')

<div @class(['p-4', 'font-bold' => true])>
    <table>
        <thead>
            <th>Topico</th>
            <th>Mensagem</th>
            <th>QoS</th>
        </thead>
        <tbody>
            @foreach ($dispositivos as $dispositivo)
    <tr>
        <td>{{ $dispositivo->topico }}</td>
        <td>{{ $dispositivo->mensagem }}</td>
        <td>{{ $dispositivo->qos }}</td>
    </tr>
    @endforeach
        </tbody>
    </table>

@endsection