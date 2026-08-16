<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pregunta extends Model
{
    protected $guarded = [];

    public function opciones()
    {
        return $this->hasMany(PreguntaOpcion::class, 'pregunta_id');
    }
}