<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle($request, \Closure $next)
    {
        $user = auth()->user();

        if (!$user || $user->rol !== 'admin') {
            abort(403, 'Acceso Denegado: Esta zona es exclusiva para Administradores.');
        }
        
        return $next($request);
    }
}

