<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\SectorsController;
use App\Http\Controllers\SmartConeController;
use App\Models\Sector;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/mycones', function () {
    return Inertia::render('MyCones');
})->middleware(['auth', 'verified'])->name('mycones');

Route::get('/dailyevents', function () {
    return Inertia::render('DailyEvents');
})->middleware(['auth', 'verified'])->name('dailyevents');

Route::get('/weeklyevents', function () {
    return Inertia::render('WeeklyEvents');
})->middleware(['auth', 'verified'])->name('weeklyevents');

Route::get('/monthlyevents', function () {
    return Inertia::render('MonthlyEvents');
})->middleware(['auth', 'verified'])->name('monthlyevents');

Route::get('/annualevents', function () {
    return Inertia::render('AnnualEvents');
})->middleware(['auth', 'verified'])->name('annualevents');

Route::get('/registersectors', function () {
    return Inertia::render('RegisterSectors');
})->middleware(['auth', 'verified'])->name('registersectors');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/registersectors', [SectorsController::class, 'store'])->name('registersectors');

Route::get('/api/sectorslist', [SectorsController::class, 'index']);

Route::get('/api/permissions', function () {
    $permission = DB::table('model_has_permissions')->select('permission_id', 'model_id')->get();
    return response()->json($permission);
});

Route::get('/api/dailyAlertCount', function () {
    $sum = DB::table('alert_perimeter_break')
        ->whereDate('created_at', today())
        ->selectRaw('COALESCE(SUM(value), 0) as dailyCount')
        ->value('dailyCount');

    return response()->json(['dailyCount' => $sum]);
});

Route::get('/api/weeklyAlertCount', function () {
    $from = now()->subDays(7);
    $to = now();

    $sum = DB::table('alert_perimeter_break')
        ->whereBetween('created_at', [$from, $to])
        ->selectRaw('COALESCE(SUM(value), 0) as weeklyCount')
        ->value('weeklyCount');

    return response()->json(['weeklyCount' => $sum]);
});

Route::get('/api/monthlyAlertCount', function () {
    $from = now()->subDays(30);
    $to = now();

    $sum = DB::table('alert_perimeter_break')
        ->whereBetween('created_at', [$from, $to])
        ->selectRaw('COALESCE(SUM(value), 0) as monthlyCount')
        ->value('monthlyCount');

    return response()->json(['monthlyCount' => $sum]);
});

Route::get('/api/annualAlertCount', function () {
    $from = now()->subDays(365);
    $to = now();

    $sum = DB::table('alert_perimeter_break')
        ->whereBetween('created_at', [$from, $to])
        ->selectRaw('COALESCE(SUM(value), 0) as annualCount')
        ->value('annualCount');

    return response()->json(['annualCount' => $sum]);
});

Route::post('/api/smart-cones', [SmartConeController::class, 'store']);

Route::get('/daily-events', [SmartConeController::class, 'getDailyEvents']);

Route::get('/sum-of-sectors', function () {
    $sectors = Sector::all();
    $total = $sectors->count();

    return response()->json(['total_sectors' => $total]);
});

require __DIR__.'/auth.php';
