<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispositivo extends Model
{
    use HasFactory;

    protected $table = 'Dispositivo';

    protected $fillable =[
        'topico',
        'mensagem',
        'qos',
        'data_hora_medicao',
    ];

    protected $guarded = ['id'];
}
