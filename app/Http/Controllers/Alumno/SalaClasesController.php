<?php

namespace App\Http\Controllers\Alumno;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Modulo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Pregunta;

class SalaClasesController extends Controller
{
    public function show(Curso $curso)
    {
      
        $curso->load(['modulos.archivos', 'preguntas']);

        $inscripcion = DB::table('inscripciones')
            ->where('alumno_id', auth()->id()) 
            ->where('curso_id', $curso->id)
            ->first();

        $completados = [];

        if ($inscripcion) {
            $completados = DB::table('progreso_modulos')
                ->where('inscripcion_id', $inscripcion->id)
                ->pluck('modulo_id')
                ->toArray();
        }

        return Inertia::render('Alumno/Show', [
            'curso' => $curso,
            'progresoGuardado' => $completados
        ]);
    }

    public function completarModulo(Modulo $modulo)
    {
        // 1. Buscamos la inscripción
        $inscripcion = DB::table('inscripciones')
            ->where('alumno_id', auth()->id()) 
            ->where('curso_id', $modulo->curso_id)
            ->first();

        if ($inscripcion) {
            // 2. Verificamos si ya había completado este módulo
            $progreso = DB::table('progreso_modulos')
                ->where('inscripcion_id', $inscripcion->id)
                ->where('modulo_id', $modulo->id)
                ->first();

            if ($progreso) {
                
                DB::table('progreso_modulos')->where('id', $progreso->id)->delete();
            } else {
                
                DB::table('progreso_modulos')->insert([
                    'inscripcion_id' => $inscripcion->id,
                    'modulo_id' => $modulo->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        return back();
    }

    public function examen(Curso $curso)
{
    $alumnoId = auth()->id();

   
    $intentosRealizados = DB::table('intentos_examen')
        ->where('curso_id', $curso->id)
        ->where('alumno_id', $alumnoId)
        ->count();

   
    $yaAprobo = DB::table('intentos_examen')
        ->where('curso_id', $curso->id)
        ->where('alumno_id', $alumnoId)
        ->where('estado', 'aprobado')
        ->exists();

    
    if ($intentosRealizados >= $curso->max_intentos && !$yaAprobo) {
        return redirect()->route('alumno.cursos.show', $curso->id)
            ->with('error', 'Has alcanzado el número máximo de intentos permitidos.');
    }

    
    $curso->load(['preguntas.opciones']);
    return Inertia::render('Alumno/Examen/Show', ['curso' => $curso]);
}

  public function finalizarExamen(Request $request, Curso $curso)
{
    $respuestasAlumno = $request->input('respuestas') ?? []; 
    $totalPreguntas = $curso->preguntas()->count();
    $correctas = 0;
    $alumnoId = auth()->id();

    // Validar cada respuesta
    foreach ($curso->preguntas as $pregunta) {
        $respuestaEnviada = $respuestasAlumno[$pregunta->id] ?? null;

        if ($respuestaEnviada !== null) {
            if ($pregunta->tipo === 'multiple') {
                $esOpcionCorrecta = \Illuminate\Support\Facades\DB::table('pregunta_opciones')
                    ->where('id', $respuestaEnviada)
                    ->where('pregunta_id', $pregunta->id)
                    ->where('es_correcta', 1) 
                    ->exists();

                if ($esOpcionCorrecta) {
                    $correctas++;
                }
            } 
            elseif ($pregunta->tipo === 'vf') {
                $enviadoComoNumero = ($respuestaEnviada === 'verdadero') ? 1 : 0;
                if ($enviadoComoNumero == $pregunta->respuesta_vf) {
                    $correctas++;
                }
            }
        }
    }

    //  Calcular porcentaje y resultado final
    $porcentaje = $totalPreguntas > 0 ? round(($correctas / $totalPreguntas) * 100) : 0;
    $aprobado = $porcentaje >= $curso->exigencia_minima;

    //  Calcular qué número de intento es este
    $intentosPrevios = \Illuminate\Support\Facades\DB::table('intentos_examen')
        ->where('curso_id', $curso->id)
        ->where('alumno_id', $alumnoId)
        ->count();
    
    $numeroIntento = $intentosPrevios + 1;

    //  Registrar el intento
    \Illuminate\Support\Facades\DB::table('intentos_examen')->insert([
        'curso_id' => $curso->id,
        'alumno_id' => $alumnoId,
        'numero_intento' => $numeroIntento,
        'calificacion' => $porcentaje,
        'estado' => $aprobado ? 'aprobado' : 'reprobado',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    //  Si aprobó, actualizamos la tabla inscripciones
    if ($aprobado) {
        \Illuminate\Support\Facades\DB::table('inscripciones')
            ->where('alumno_id', $alumnoId)
            ->where('curso_id', $curso->id)
            ->update([
                'estado' => 'completado',
                'fecha_termino' => now(), // 
                'updated_at' => now()
            ]);
    }

    $intentosRestantes = $curso->max_intentos - $numeroIntento;
    if ($intentosRestantes < 0) {
        $intentosRestantes = 0;
    }

    //  Retornar la vista de resultados
    return \Inertia\Inertia::render('Alumno/Examen/Resultado', [
        'curso' => $curso,
        'resultado' => [
            'aprobado' => $aprobado,
            'porcentaje' => $porcentaje,
            'correctas' => $correctas,
            'total' => $totalPreguntas,
            'intentos_restantes' => $intentosRestantes
        ]
    ]);
}

    public function verCertificado(Curso $curso)
    {
        $alumnoId = auth()->id();

        $aprobado = \Illuminate\Support\Facades\DB::table('intentos_examen')
            ->where('curso_id', $curso->id)
            ->where('alumno_id', $alumnoId)
            ->where('estado', 'aprobado')
            ->exists();
        if (!$aprobado || !$curso->archivo_certificado) {
            abort(403, 'No tienes permiso para ver este certificado o el profesor aún no lo ha subido.');
        }

      
        $rutaAbsoluta = storage_path('app/public/' . $curso->archivo_certificado);

        if (!file_exists($rutaAbsoluta)) {
            abort(404, 'El archivo del certificado no se encontró en el servidor.');
        }

        return response()->file($rutaAbsoluta);
    }
}