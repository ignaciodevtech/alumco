<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class SoloAlumnos
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user->rol === 'admin' || $user->rol === 'profesor') {
            return redirect('/dashboard'); 
        }

        return $next($request);
    }
}