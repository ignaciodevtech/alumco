<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();

        dd('¡Freno de mano! Llegaste al Semáforo y tu rol es: ' . $user->rol);

        if (!$user) {
            return redirect('/login');
        }

        if ($user->rol === 'admin') {
            return redirect()->route('admin.cursos.index');
        }

        if ($user->rol === 'profesor') {
            return redirect()->route('profesor.cursos.index');
        }

        // Por defecto el usuario nuevo es alumno
        return redirect()->route('alumno.dashboard');
    }
}