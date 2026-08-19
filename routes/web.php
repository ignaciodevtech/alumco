<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Importamos los controladores del Admin
use App\Http\Controllers\Admin\CursoController as AdminCursoController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Middleware\SoloAlumnos;

// Importamos el controlador del Profesor
use App\Http\Controllers\Profesor\CursoController as ProfesorCursoController;

// Importamos el controlador del Alumno
use App\Http\Controllers\Alumno\DashboardController as AlumnoDashboardController;
use App\Http\Controllers\Alumno\ExplorarController;
use App\Http\Controllers\Alumno\SalaClasesController; 

use App\Models\Inscripcion;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/dashboard', function () {
    $user = \Illuminate\Support\Facades\Auth::user();

    if ($user->rol === 'admin') {
        return redirect()->route('admin.cursos.index');
    }
    if ($user->rol === 'profesor') {
        return redirect()->route('profesor.cursos.index');
    }
    
    return redirect()->route('alumno.dashboard');

})->middleware(['auth'])->name('dashboard');


Route::middleware('auth')->group(function () {
    
    // RUTA DEL PERFIL DE ADMIN 
    Route::get('/admin/perfil', function () {
        return Inertia::render('Admin/Perfil', [
            'estadisticas' => [
                'cursos_completados' => 12,
                'certificados' => 8,
                'promedio' => 95
            ]
        ]);
    })->name('admin.perfil');


    // ZONA ADMINISTRADOR
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        // Cursos 
        Route::get('/cursos', [AdminCursoController::class, 'index'])->name('cursos.index');
        Route::get('/cursos/crear', [AdminCursoController::class, 'create'])->name('cursos.create');
        Route::post('/cursos', [AdminCursoController::class, 'store'])->name('cursos.store');
        Route::get('/cursos/{id}/editar', [AdminCursoController::class, 'edit'])->name('cursos.edit');
        Route::post('/cursos/{id}/actualizar', [AdminCursoController::class, 'update'])->name('cursos.update');
        Route::delete('/cursos/{id}/eliminar', [AdminCursoController::class, 'destroy'])->name('cursos.destroy');
        Route::delete('/archivos/{id}', [AdminCursoController::class, 'eliminarArchivo'])->name('archivos.destroy');

        // Usuarios
        Route::get('/estadisticas', [UsuarioController::class, 'estadisticas'])->name('estadisticas');

        //cambio de rol
       Route::put('/usuarios/{usuario}/rol', [UsuarioController::class, 'actualizarRol'])->name('usuarios.actualizar-rol');

        // Alumnos
        Route::get('/alumnos', [UsuarioController::class, 'alumnos'])->name('alumnos.index');
        Route::get('/alumnos/{id}', [UsuarioController::class, 'verAlumno'])->name('alumnos.show');
        Route::post('/alumnos/masivo', [UsuarioController::class, 'procesarMasivo'])->name('alumnos.masivo');
        
        // Profesores
        Route::get('/profesores', [UsuarioController::class, 'profesores'])->name('profesores.index');
        Route::get('/profesores/{id}', [UsuarioController::class, 'verProfesor'])->name('profesores.show');
    });

    
    // ZONA PROFESORES
    Route::prefix('profesor')->name('profesor.')->group(function () {
        Route::get('/mis-cursos', [ProfesorCursoController::class, 'index'])->name('cursos.index');
        Route::get('/cursos/crear', [ProfesorCursoController::class, 'create'])->name('cursos.create');
        Route::post('/cursos/guardar', [ProfesorCursoController::class, 'store'])->name('cursos.store');
        Route::get('/cursos/{id}/editar', [ProfesorCursoController::class, 'edit'])->name('cursos.edit');
        Route::post('/cursos/{id}/actualizar', [ProfesorCursoController::class, 'update'])->name('cursos.update');
        Route::delete('/cursos/{id}/eliminar', [ProfesorCursoController::class, 'destroy'])->name('cursos.destroy');
        Route::delete('/archivos/{id}', [ProfesorCursoController::class, 'eliminarArchivo'])->name('archivos.destroy');
    });


    // ZONA ALUMNOS 
    Route::prefix('alumno')->name('alumno.')->middleware([SoloAlumnos::class])->group(function () {
    
    Route::get('/dashboard', [AlumnoDashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/explorar', [ExplorarController::class, 'index'])->name('explorar');
    
    Route::post('/inscribir/{curso}', [ExplorarController::class, 'inscribir'])->name('inscribir');
    
    Route::get('/cursos/{curso}', [SalaClasesController::class, 'show'])->name('cursos.show');

    Route::post('/modulos/{modulo}/completar', [SalaClasesController::class, 'completarModulo'])->name('modulos.completar');

    Route::get('/cursos/{curso}/examen', [SalaClasesController::class, 'examen'])->name('examen.show');

    Route::post('/cursos/{curso}/examen/finalizar', [SalaClasesController::class, 'finalizarExamen'])->name('examen.finalizar');

    Route::get('/cursos/{curso}/certificado', [App\Http\Controllers\Alumno\SalaClasesController::class, 'verCertificado'])->name('cursos.certificado');
});

Route::get('/mis-logros', function () {
    $user = Auth::user();

    $inscripcionesCompletadas = Inscripcion::with('curso')
        ->where('alumno_id', $user->id) 
        ->whereNotNull('fecha_termino') 
        ->get();

    $cursos = $inscripcionesCompletadas->map(function ($inscripcion) {
        return [
            'id' => $inscripcion->curso->id,
            'titulo' => $inscripcion->curso->titulo, 
            'fecha_termino' => Carbon::parse($inscripcion->fecha_termino)->translatedFormat('d \d\e F, Y'),
        ];
    });

    $certificados = $inscripcionesCompletadas->map(function ($inscripcion) {
        
        $rutaCertificado = $inscripcion->curso->archivo_certificado;
        
        $urlDescarga = $rutaCertificado ? asset('storage/' . $rutaCertificado) : '#';

        return [
            'id' => $inscripcion->id,
            'titulo' => 'Certificado: ' . $inscripcion->curso->titulo,
            'fecha_obtencion' => Carbon::parse($inscripcion->fecha_termino)->translatedFormat('d \d\e F, Y'),
            'url_descarga' => $urlDescarga, 
        ];
    });

    return Inertia::render('Alumno/MisLogros', [
        'cursos' => $cursos,
        'certificados' => $certificados
    ]);
})->middleware(['auth', 'verified'])->name('mis-logros');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});

require __DIR__.'/auth.php';