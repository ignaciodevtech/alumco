<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Curso;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class UsuarioController extends Controller
{
    public function alumnos(Request $request)
    {
        
        $query = User::where('rol', 'alumno');

        if ($request->buscar) {
            $query->where('name', 'like', "%{$request->buscar}%");
        }

        $alumnos = $query->latest()->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'sexo' => $user->sexo ?? 'No definido',
                'edad' => $user->fecha_nacimiento ? Carbon::parse($user->fecha_nacimiento)->age : 'N/A',
                'sede' => $user->sede ?? 'Sin sede', 
                'rol' => $user->rol                  
            ];
        });

        return Inertia::render('Admin/Usuarios/Alumnos', [
            'usuarios' => $alumnos,
            'cursos' => Curso::where('estado', 'publicado')->get(['id', 'titulo']),
            'filtros' => $request->only(['buscar'])
        ]);
    }
// Función para inscribir/desinscribir alumnos masivamente a un curso
    public function inscripcionMasiva(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'curso_id' => 'required|exists:cursos,id',
            'accion' => 'required|in:inscribir,desinscribir'
        ]);

        if ($request->accion === 'inscribir') {
            foreach ($request->user_ids as $userId) {
                // firstOrCreate evita duplicados
                Inscripcion::firstOrCreate([
                    'user_id' => $userId,
                    'curso_id' => $request->curso_id
                ]);
            }
        } else {
            Inscripcion::whereIn('user_id', $request->user_ids)
                       ->where('curso_id', $request->curso_id)
                       ->delete();
        }

        return back()->with('success', 'Operación masiva completada con éxito.');
    }

    public function profesores(Request $request)
    {
        $query = User::whereIn('rol', ['profesor', 'admin']);

        if ($request->buscar) {
            $query->where('name', 'like', "%{$request->buscar}%");
        }

        $profesores = $query->latest()->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'sexo' => $user->sexo ?? 'No definido',
                'edad' => $user->fecha_nacimiento ? Carbon::parse($user->fecha_nacimiento)->age : 'N/A',
                'sede' => $user->sede ?? 'Sin sede', 
                'rol' => $user->rol                  
            ];
        });

        return Inertia::render('Admin/Usuarios/Profesores', [
            'usuarios' => $profesores,
            'filtros' => $request->only(['buscar'])
        ]);
    }

    
    public function verAlumno($id)
    {
        $alumno = User::where('rol', 'alumno')
                      ->with('cursosInscritos') 
                      ->findOrFail($id);
        
        $alumno->edad = $alumno->fecha_nacimiento ? Carbon::parse($alumno->fecha_nacimiento)->age : 'N/A';

        return Inertia::render('Admin/Usuarios/AlumnoPerfil', [
            'alumno' => $alumno
        ]);
    }

    
    public function verProfesor($id)
    {
        $profesor = User::with('cursos')->findOrFail($id);
        $profesor->edad = $profesor->fecha_nacimiento ? Carbon::parse($profesor->fecha_nacimiento)->age : 'N/A';

        return Inertia::render('Admin/Usuarios/ProfesorPerfil', [
            'profesor' => $profesor
        ]);
    }

    public function actualizarRol(Request $request, User $usuario)
    {
        $request->validate([
            'rol' => 'required|in:admin,profesor,alumno'
        ]);

        $usuario->update([
            'rol' => $request->rol
        ]);

        return redirect()->back()->with('success', 'Rol actualizado correctamente.');
    }

    public function procesarMasivo(Request $request)
    {
      
        $request->validate([
            'user_ids' => 'required|array',
            'curso_id' => 'required|exists:cursos,id',
            'accion' => 'required|in:inscribir,desinscribir'
        ]);

        $cursoId = $request->curso_id;
        $userIds = $request->user_ids;

        
        if ($request->accion === 'inscribir') {
            foreach ($userIds as $userId) {
                
                \App\Models\Inscripcion::firstOrCreate([
                    'alumno_id' => $userId, 
                    'curso_id' => $cursoId
                ], [
                    'estado' => 'en_progreso',
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        } elseif ($request->accion === 'desinscribir') {
            \App\Models\Inscripcion::whereIn('alumno_id', $userIds) 
                ->where('curso_id', $cursoId)
                ->delete();
        }

        return redirect()->back()->with('success', 'Acción masiva realizada correctamente.');
    }
// Función para mostrar estadísticas de usuarios
    public function estadisticas()
    {
        $totalUsuarios = User::count();

        $porRol = User::select('rol', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->groupBy('rol')
            ->get();

        $porSexo = User::select('sexo', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->whereNotNull('sexo')
            ->groupBy('sexo')
            ->get();

        $porSede = User::select('sede', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->whereNotNull('sede')
            ->groupBy('sede')
            ->get();

        $porEdad = User::select(
            \Illuminate\Support\Facades\DB::raw('
                CASE 
                    WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) < 20 THEN "Menores de 20"
                    WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 20 AND 29 THEN "20-29 años"
                    WHEN TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN 30 AND 39 THEN "30-39 años"
                    ELSE "40+ años" 
                END as rango
            '),
            \Illuminate\Support\Facades\DB::raw('count(*) as total')
        )
        ->whereNotNull('fecha_nacimiento') 
        ->groupBy('rango')
        ->get();
 
        return Inertia::render('Admin/Estadisticas', [
            'totalUsuarios' => $totalUsuarios,
            'porRol' => $porRol,
            'porSexo' => $porSexo,
            'porSede' => $porSede,
            'porEdad' => $porEdad
        ]);
    }
}