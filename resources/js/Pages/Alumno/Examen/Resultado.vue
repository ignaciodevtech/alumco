<template>
    <Head :title="'Resultados: ' + curso.titulo" />

    <AuthenticatedLayout>
        <div class="py-12 bg-slate-50 min-h-screen flex items-center justify-center">
            <div class="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                
                <div v-if="resultado.aprobado" class="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden text-center">
                    <div class="bg-green-50 py-10 px-8 border-b border-green-100">
                        <div class="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-md border-4 border-green-100">
                            🏆
                        </div>
                        <h1 class="text-3xl font-extrabold text-green-900 mb-2">¡Felicidades, aprobaste!</h1>
                        <p class="text-green-700 text-lg">Has superado la evaluación final con éxito.</p>
                    </div>
                    
                    <div class="p-8">
                        <div class="flex justify-center gap-12 mb-8">
                            <div>
                                <p class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Tu Puntaje</p>
                                <p class="text-3xl font-black text-slate-900">{{ resultado.porcentaje }}%</p>
                            </div>
                            <div>
                                <p class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Respuestas</p>
                                <p class="text-3xl font-black text-slate-900">{{ resultado.correctas }} / {{ resultado.total }}</p>
                            </div>
                        </div>

                        <p class="text-slate-600 mb-8">
                            Has completado satisfactoriamente todos los requisitos del curso <strong>{{ curso.titulo }}</strong>. Tu certificado ya está disponible.
                        </p>

                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a :href="route('alumno.dashboard')" class="px-6 py-3.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition w-full sm:w-auto">
                                Volver a Mis Cursos
                            </a>
                            <a :href="route('alumno.cursos.certificado', curso.id)" target="_blank" class="px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-md w-full sm:w-auto flex items-center justify-center gap-2">
                                <span>📄</span> Ver Certificado
                            </a>
                        </div>
                    </div>
                </div>

                <div v-else class="bg-white rounded-3xl shadow-lg border border-red-100 overflow-hidden text-center">
                    <div class="bg-red-50 py-10 px-8 border-b border-red-100">
                        <div class="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-md border-4 border-red-100">
                            ⚠️
                        </div>
                        <h1 class="text-3xl font-extrabold text-red-900 mb-2">No has alcanzado el mínimo</h1>
                        <p class="text-red-700 text-lg">Necesitabas un {{ curso.exigencia_minima }}% para aprobar.</p>
                    </div>
                    
                    <div class="p-8">
                        <div class="flex justify-center gap-12 mb-8">
                            <div>
                                <p class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Tu Puntaje</p>
                                <p class="text-3xl font-black text-red-600">{{ resultado.porcentaje }}%</p>
                            </div>
                            <div>
                                <p class="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Respuestas</p>
                                <p class="text-3xl font-black text-slate-900">{{ resultado.correctas }} / {{ resultado.total }}</p>
                            </div>
                        </div>

                        <div v-if="resultado.intentos_restantes > 0" class="mb-8">
                            <p class="text-slate-600 mb-2">
                                No te desanimes. Repasa el contenido de los módulos y vuelve a intentarlo cuando te sientas preparado.
                            </p>
                            <p class="inline-block bg-orange-100 text-orange-800 font-bold px-4 py-2 rounded-lg text-sm">
                                Te quedan {{ resultado.intentos_restantes }} intento(s).
                            </p>
                        </div>
                        
                        <div v-else class="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p class="text-red-700 font-bold">
                                Te has quedado sin intentos. Espera cierto tiempo para volver a intentarlo.
                            </p>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link :href="route('alumno.cursos.show', curso.id)" class="px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-md w-full sm:w-auto">
                                Volver al Curso
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';

defineProps({
    curso: Object,
    resultado: Object
});
</script>