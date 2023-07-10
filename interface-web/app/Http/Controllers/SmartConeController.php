<?php

namespace App\Http\Controllers;

use App\Models\AlertPerimeterBreak;
use App\Models\SmartCone;
use App\Models\Sector;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\Permission\Traits\HasRoles;

class SmartConeController extends Controller
{
    use HasRoles;

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

        $now = date('Y-m-d H:i:s');
        $dayOfWeek = date('w', strtotime($now));
        
        // Definir o período de tempo com base na unidade fornecida
        if ($unit === 'day') {
            $startDate->startOfDay();
            $endDate->endOfDay();
        } elseif ($unit === 'week') {
            $startDate->startOfWeek()->subWeek();
            $endDate->endOfWeek()->subWeek();
        } elseif ($unit === 'month') {
            $startDate->startOfMonth();
            $endDate->endOfMonth();
        } elseif ($unit === 'year') {
            $startDate->startOfYear();
            $endDate->endOfYear();
        } else {
            return response()->json(['error' => 'Unidade de tempo inválida.']);
        }

        $user = auth()->user();

        if ($user->hasPermissionTo('admin')) {
            // Usuário tem permissão de administrador, buscar todos os eventos
            $events = AlertPerimeterBreak::whereBetween('created_at', [$startDate, $endDate])->get();
        } elseif ($user->hasPermissionTo('operator')) {
            // Usuário tem permissão de operador, buscar eventos associados aos cones do usuário
            $userMacs = SmartCone::where('user_id', $user->id)->pluck('mac')->toArray();
            $events = AlertPerimeterBreak::whereIn('mac', $userMacs)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get();
        } else {
            return response()->json(['error' => 'Usuário sem permissão.']);
        }

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


    public function getTotalEventsByTimeUnit($unit)
    {
        $startDate = Carbon::now();
        $endDate = Carbon::now();
    
        // Definir o período de tempo com base na unidade fornecida
        if ($unit === 'day') {
            $startDate->startOfDay();
            $endDate->endOfDay();
        } elseif ($unit === 'week') {
            $startDate->subDays(7); // Modificação: Subtrai 7 dias da data atual
        } elseif ($unit === 'month') {
            $startDate->subDays(30); // Modificação: Subtrai 30 dias da data atual
        } elseif ($unit === 'year') {
            $startDate->subDays(365); // Modificação: Subtrai 365 dias da data atual
        } else {
            return response()->json(['error' => 'Unidade de tempo inválida.']);
        }
    
        $user = auth()->user();
    
        if ($user->hasPermissionTo('admin')) {
            // Usuário tem permissão de administrador, buscar todos os eventos
            $totalEvents = AlertPerimeterBreak::whereBetween('created_at', [$startDate, $endDate])->count();
        } elseif ($user->hasPermissionTo('operator')) {
            // Usuário tem permissão de operador, buscar eventos associados aos cones do usuário
            $userMacs = SmartCone::where('user_id', $user->id)->pluck('mac')->toArray();
            $totalEvents = AlertPerimeterBreak::whereIn('mac', $userMacs)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();
        } else {
            return response()->json(['error' => 'Usuário sem permissão.']);
        }
    
        return response()->json(['totalEvents' => (string)$totalEvents]);
    }

    public function show()
    {
        $user = auth()->user();
        
        if ($user->hasPermissionTo('admin')) {
            $cones = SmartCone::all();
        } else {
            $cones = SmartCone::where('user_id', $user->id)->get();
        }
    
        $coneDetails = [];
    
        foreach ($cones as $cone) {
            $sector = Sector::find($cone->sector_id);
            $responsaveis = User::where('id', $cone->user_id)->pluck('name')->toArray();
    
            $coneDetails[] = [
                'id' => $cone->id,
                'mac' => $cone->mac,
                'setor' => $sector ? $sector->name : 'Unknown',
                'responsavel' => implode(', ', $responsaveis),
            ];
        }
    
        return response()->json($coneDetails);
    }
    
public function update(Request $request, $mac)
{
    $smartCone = SmartCone::where('mac', $mac)->first();

    if (!$smartCone) {
        return response()->json(['error' => 'Smart cone not found.'], 404);
    }

    $data = $request->validate([
        'sector' => 'required|exists:sectors,id',
    ]);

    $smartCone->sector_id = $data['sector'];
    $smartCone->save();

    return response()->json(['message' => 'Smart cone updated successfully']);
}

public function destroy($mac)
{
    $smartCones = SmartCone::where('mac', $mac)->get();

    if ($smartCones->isEmpty()) {
        return response()->json(['error' => 'Smart cone not found.'], 404);
    }

    $smartCones->each->delete();

    return response()->json(['message' => 'Smart cones deleted successfully']);
}

    
}
