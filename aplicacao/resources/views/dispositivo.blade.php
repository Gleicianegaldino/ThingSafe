@extends('layouts.app')

@section('content')
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <table class="table">
        <thead class="thead-dark">
            <th scope="col">Topico</th>
            <th scope="col">Mensagem</th>
            
        </thead>
        <tbody>
            @foreach ($dispositivo as $dispositivo)
    <tr>
       
        <td>{{ $dispositivo->topico }}</td>
        <td>{{ $dispositivo->mensagem }}</td>
       
    </tr>
    @endforeach
        </tbody>
    </table>

@endsection