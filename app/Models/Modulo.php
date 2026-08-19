<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    protected $guarded = [];

    public function archivos()
    {
        return $this->hasMany(ModuloArchivo::class);
    }
}