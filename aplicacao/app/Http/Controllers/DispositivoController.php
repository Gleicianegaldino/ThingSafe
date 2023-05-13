<?php

namespace App\Http\Controllers;
use App\Models\Dispositivo;

use Illuminate\Http\Request;

class DispositivoController extends Controller
{
    public function index(){
        $dispositivo = Dispositivo::all('topico','mensagem');

        return view('dispositivo', compact('dispositivo'));
    }
}
