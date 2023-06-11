<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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

Route::get('/sectorslist', function () {
    return Inertia::render('SectorsList');
})->middleware(['auth', 'verified'])->name('sectorslist');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/api/permissions', function () {
    $permission = DB::table('model_has_permissions')->select('permission_id', 'model_id')->get();
    return response()->json($permission);
});

Route::get('/api/dailyAlertCount', function () {
    $sum = DB::table('alert_perimeter_break')
        ->whereDate('created_at', today())
        ->selectRaw('COALESCE(SUM(status), 0) as count')
        ->value('dailyCount');

    return response()->json(['dailyCount' => $sum]);
});

Route::get('/api/weeklyAlertCount', function () {
    $from = today();
    $to =  date('d-m-Y', strtotime('-1 week'));

    $sum = DB::table('alert_perimeter_break')
        ->whereBetween('created_at', [$from, $to])
        ->selectRaw('COALESCE(SUM(status), 0) as count')
        ->value('weeklyCount');

    return response()->json(['weeklyCount' => $sum]);
});

Route::get('/api/monthlyAlertCount', function () {
    $from = today();
    $to = date('d-m-Y', strtotime('-1 month'));

    $sum = DB::table('alert_perimeter_break')
        ->whereBetween('created_at', [$from, $to])
        ->selectRaw('COALESCE(SUM(status), 0) as count')
        ->value('monthlyCount');

    return response()->json(['monthlyCount' => $sum]);
});

Route::get('/api/annualAlertCount', function () {
    $from = today();
    $to =  date('d-m-Y', strtotime('-1 ye'));

    $sum = DB::table('alert_perimeter_break')
        ->whereBetween('created_at', [$from, $to])
        ->selectRaw('COALESCE(SUM(status), 0) as count')
        ->value('annualCount');

    return response()->json(['annualCount' => $sum]);
});

require __DIR__.'/auth.php';
