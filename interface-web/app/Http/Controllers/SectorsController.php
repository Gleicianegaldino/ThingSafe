<?php

namespace App\Http\Controllers;

use App\Models\Sector;
use Illuminate\Http\Request;

class SectorsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $sector = new Sector();
        $sector->name = $request->input('name');
        $sector->save();
    }

    public function index()
    {
        $sectors = Sector::all();

        return response()->json($sectors);
    }
    public function destroy($name)
    {
        $sectors = Sector::where('name', $name)->get();

        if ($sectors->isEmpty()) {
            return response()->json(['message' => 'Setor não encontrado'], 404);
        }

        $sectors->each(function ($sector) {
            $sector->delete();
        });

        return response()->json(['message' => 'Setores excluídos com sucesso']);
    }

    public function getDistinctSectors() //Pegar os setores/elimina os nomes iguais
    {
        $distinctSectors = Sector::distinct('name')->pluck('name');

        return response()->json(['sectors' => $distinctSectors]);
    }
}
