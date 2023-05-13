<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dispositivo;

class DispositivoController extends Controller
{
    public function index(){
        $dispositivos = Dispositivo::select('topico','mensagem')->get();
        return view('dispositivo', compact('dispositivos'));
    }
}
