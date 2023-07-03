<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmartCone extends Model
{
    protected $table = 'smart_cone';
    public $timestamps = false;

    protected $fillable = [
        'mac',
        'user_id',
    ];
    
}
