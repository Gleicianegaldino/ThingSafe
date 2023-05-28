@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body">
                    @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                    @endif

                    @can('user')
                        Dados do usuário
                    @elsecan('admin')
                        <a href="{{route('log_invasoes')}}" type="button" class="btn btn-outline-danger">Logs das invasões</a>
                    @endcan

                </div>
            </div>
        </div>
    </div>
</div>
@stop