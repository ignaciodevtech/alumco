<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $guarded = [];

    public function profesor()
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }

    public function alumnos()
    {
        return $this->belongsToMany(User::class, 'inscripciones', 'curso_id', 'alumno_id')
                    ->withPivot('estado')
                    ->withTimestamps();
    }

    public function modulos()
    {
        return $this->hasMany(Modulo::class, 'curso_id');
    }

    public function preguntas()
    {
        return $this->hasMany(Pregunta::class, 'curso_id');
    }
}