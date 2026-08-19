<?php

namespace App\Http\Controllers\Alumno;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $alumno = Auth::user();
        
        $misCursos = $alumno->cursosInscritos()
            ->select('cursos.id', 'titulo', 'descripcion', 'imagen_portada')
            ->withPivot('estado') 
            ->get();

        return Inertia::render('Alumno/Dashboard', [
            'misCursos' => $misCursos
        ]);
    }
}