<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CursoController extends Controller
{
    public function index()
    {
        $cursos = auth()->user()->cursos()->latest()->get();
        return Inertia::render('Profesor/Cursos/Index', ['cursos' => $cursos]);
    }

    public function create()
    {
        return Inertia::render('Profesor/Cursos/Create');
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $rutaImagen = $request->hasFile('imagen_portada') 
                ? $request->file('imagen_portada')->store('portadas_cursos', 'public') 
                : null;

            $rutaCertificado = $request->hasFile('archivo_certificado') 
                ? $request->file('archivo_certificado')->store('certificados', 'public') 
                : null;

            $curso = Curso::create([
                'profesor_id' => auth()->id(), 
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'exigencia_minima' => $request->exigencia_minima,
                'max_intentos' => $request->max_intentos,
                'estado' => $request->estado,
                'imagen_portada' => $rutaImagen,
                'archivo_certificado' => $rutaCertificado, 
            ]);

            if ($request->has('modulos')) {
                foreach ($request->modulos as $index => $moduloData) {
                    if (!empty($moduloData['titulo'])) {
                        $nuevoModulo = $curso->modulos()->create([
                            'titulo' => $moduloData['titulo'],
                            'descripcion_contenido' => $moduloData['contenido'],
                            'duracion' => $moduloData['duracion'] ?? null,
                            'link_video' => $moduloData['link_video'] ?? null,
                        ]);

                        if ($request->hasFile("modulos.$index.archivos_nuevos")) {
                            foreach ($request->file("modulos.$index.archivos_nuevos") as $archivo) {
                                $nuevoModulo->archivos()->create([
                                    'nombre_archivo' => $archivo->getClientOriginalName(),
                                    'ruta_archivo' => $archivo->store('recursos_cursos', 'public'),
                                ]);
                            }
                        }
                    }
                }
            }

            // Logica de Examen Final
            if ($request->has('preguntas')) {
                foreach ($request->preguntas as $preguntaData) {
                    if (!empty($preguntaData['texto'])) {
                        $pregunta = $curso->preguntas()->create([
                            'tipo' => $preguntaData['tipo'],
                            'texto_pregunta' => $preguntaData['texto'],
                            'respuesta_vf' => $preguntaData['tipo'] === 'vf' ? $preguntaData['respuesta_vf'] : null,
                        ]);

                        if ($preguntaData['tipo'] === 'multiple' && isset($preguntaData['opciones'])) {
                            foreach ($preguntaData['opciones'] as $opcion) {
                                if (!empty($opcion['texto'])) {
                                    $pregunta->opciones()->create([
                                        'texto_opcion' => $opcion['texto'],
                                        'es_correcta' => $opcion['es_correcta'],
                                    ]);
                                }
                            }
                        }
                    }
                }
            }

            DB::commit();
            return redirect()->route('profesor.cursos.index')->with('success', 'Curso creado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al guardar: ' . $e->getMessage()]);
        }
    }

    public function edit($id)
    {
        $curso = Curso::where('profesor_id', auth()->id())->with(['modulos.archivos', 'preguntas.opciones'])->findOrFail($id);
        return Inertia::render('Profesor/Cursos/Edit', ['curso' => $curso]);
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $curso = Curso::where('profesor_id', auth()->id())->findOrFail($id);

            $datosBasicos = [
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'exigencia_minima' => $request->exigencia_minima,
                'max_intentos' => $request->max_intentos,
                'estado' => $request->estado,
            ];

            if ($request->hasFile('imagen_portada')) {
                if ($curso->imagen_portada) Storage::disk('public')->delete($curso->imagen_portada);
                $datosBasicos['imagen_portada'] = $request->file('imagen_portada')->store('portadas_cursos', 'public');
            }

            if ($request->hasFile('archivo_certificado')) {
                if ($curso->archivo_certificado) Storage::disk('public')->delete($curso->archivo_certificado);
                $datosBasicos['archivo_certificado'] = $request->file('archivo_certificado')->store('certificados', 'public');
            }

            $curso->update($datosBasicos);

            $modulosIdsEnviados = collect($request->modulos)->pluck('id')->filter(function($id) { return !empty($id) && $id !== 'null'; })->all();
            $curso->modulos()->whereNotIn('id', $modulosIdsEnviados)->delete();

            if ($request->has('modulos')) {
                foreach ($request->modulos as $index => $moduloData) {
                    if (!empty($moduloData['titulo'])) {
                        $idModulo = (isset($moduloData['id']) && $moduloData['id'] !== 'null' && $moduloData['id'] !== '') ? $moduloData['id'] : null;
                        $modulo = $curso->modulos()->updateOrCreate(
                            ['id' => $idModulo],
                            [
                                'titulo' => $moduloData['titulo'],
                                'descripcion_contenido' => $moduloData['contenido'],
                                'duracion' => $moduloData['duracion'] ?? null,
                                'link_video' => $moduloData['link_video'] ?? null,
                            ]
                        );

                        if ($request->hasFile("modulos.$index.archivos_nuevos")) {
                            foreach ($request->file("modulos.$index.archivos_nuevos") as $archivo) {
                                $modulo->archivos()->create([
                                    'nombre_archivo' => $archivo->getClientOriginalName(),
                                    'ruta_archivo' => $archivo->store('recursos_cursos', 'public'),
                                ]);
                            }
                        }
                    }
                }
            }

            $curso->preguntas()->delete();
            if ($request->has('preguntas')) {
                foreach ($request->preguntas as $preguntaData) {
                    if (!empty($preguntaData['texto'])) {
                        $pregunta = $curso->preguntas()->create([
                            'tipo' => $preguntaData['tipo'],
                            'texto_pregunta' => $preguntaData['texto'],
                            'respuesta_vf' => $preguntaData['tipo'] === 'vf' ? $preguntaData['respuesta_vf'] : null,
                        ]);

                        if ($preguntaData['tipo'] === 'multiple' && isset($preguntaData['opciones'])) {
                            foreach ($preguntaData['opciones'] as $opcion) {
                                if (!empty($opcion['texto'])) {
                                    $pregunta->opciones()->create([
                                        'texto_opcion' => $opcion['texto'],
                                        'es_correcta' => $opcion['es_correcta'],
                                    ]);
                                }
                            }
                        }
                    }
                }
            }

            DB::commit();
            return redirect()->route('profesor.cursos.index')->with('success', 'Curso actualizado exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $curso = Curso::where('profesor_id', auth()->id())->findOrFail($id);
        if ($curso->imagen_portada) Storage::disk('public')->delete($curso->imagen_portada);
        if ($curso->archivo_certificado) Storage::disk('public')->delete($curso->archivo_certificado);
        $curso->delete();

        return redirect()->route('profesor.cursos.index')->with('success', 'Curso eliminado');
    }
}