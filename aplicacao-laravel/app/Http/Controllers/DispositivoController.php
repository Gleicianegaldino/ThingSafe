<?php

namespace App\Http\Controllers;

use App\Models\Dispositivo;
use Illuminate\Http\Request;

class DispositivoController extends Controller
{
    public function index(){
        $dispositivos = Dispositivo::select('topico','mensagem')->get();

        return view('dispositivos', compact('dispositivos'));
    }


    public function tudo(){
        $dispositivos = Dispositivo::all();
        return view('tudo', ['dispositivos' => $dispositivos]);
    }

   

}
