<?php

namespace App\Http\Controllers;

use App\Models\AlertPerimeterBreak;
use App\Models\SmartCone;
use App\Models\Sector;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SmartConeController extends Controller
{
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'coneId' => 'required',
                'sector' => 'required|exists:sectors,id',
            ]);

            $smartCone = new SmartCone();
            $smartCone->mac = $data['coneId'];
            $smartCone->user_id = auth()->user()->id;
            $smartCone->sector_id = $data['sector'];

            $smartCone->save();

            return response()->json(['message' => 'Smart cone activated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to activate smart cone', 'details' => $e->getMessage()], 500);
        }
    }

    public function getEventsByTimeUnit($unit)
    {
        $startDate = Carbon::now();
        $endDate = Carbon::now();
    
        // Definir o período de tempo com base na unidade fornecida
        if ($unit === 'day') {
            $startDate->startOfDay();
            $endDate->endOfDay();
        } elseif ($unit === 'week') {
            $startDate->startOfWeek();
            $endDate->endOfWeek();
        } elseif ($unit === 'month') {
            $startDate->startOfMonth();
            $endDate->endOfMonth();
        } elseif ($unit === 'year') {
            $startDate->startOfYear();
            $endDate->endOfYear();
        } else {
            return response()->json(['error' => 'Unidade de tempo inválida.']);
        }
    
        $events = AlertPerimeterBreak::whereBetween('created_at', [$startDate, $endDate])->get();
        $eventsWithDetails = [];
    
        foreach ($events as $event) {
            $smartCone = SmartCone::where('mac', $event->mac)->first();
    
            if ($smartCone) {
                $sector = Sector::find($smartCone->sector_id);
                $responsaveis = User::where('id', $smartCone->user_id)->pluck('name')->toArray();
    
                $eventDetails = [
                    'setor' => $sector ? $sector->name : 'Unknown',
                    'responsavel' => implode(', ', $responsaveis),
                    'created_at' => $event->created_at,
                ];
    
                $eventsWithDetails[] = $eventDetails;
            }
        }
    
        return response()->json($eventsWithDetails);
    }
    
}
