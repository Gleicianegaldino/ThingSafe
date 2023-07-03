<?php
namespace App\Http\Controllers;

use App\Models\SmartCone;
use Illuminate\Http\Request;

class SmartConeController extends Controller
{
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'coneId' => 'required',
                
            ]);

            $smartCone = new SmartCone();
            $smartCone->mac = $data['coneId'];
            
            if (auth()->check()) {
                $smartCone->user_id = auth()->user()->id;
            } else {
                // Usuário não autenticado
                // Decida o que fazer nesse caso, por exemplo, atribuir um valor padrão ou lançar uma exceção
            }

            $smartCone->save();

            // Você pode adicionar mais lógica aqui, se necessário

            return response()->json(['message' => 'Smart cone activated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to activate smart cone', 'details' => $e->getMessage()], 500);
        }
    }
}
