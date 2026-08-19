<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuloArchivo extends Model
{
    protected $guarded = [];

    public function archivos()
    {
        return $this->hasMany(ModuloArchivo::class, 'modulo_id');
    }
}