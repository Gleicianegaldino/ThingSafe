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
}
