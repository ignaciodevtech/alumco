<template>
    <Head :title="curso.titulo" />

    <AuthenticatedLayout>
        <div class="py-8 bg-slate-50 min-h-screen">
            <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
                
                <div class="mb-8 flex items-start gap-5">
                    <Link :href="route('alumno.dashboard')" class="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition shadow-sm mt-1">
                        <span>&larr;</span> Volver
                    </Link>
                    
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-slate-900 mb-2">{{ curso.titulo }}</h1>
                        <p class="text-slate-500 text-base max-w-3xl mb-6">{{ curso.descripcion }}</p>
                        
                        <div class="flex items-center gap-6 text-sm text-slate-500 mb-2">
                            <span class="flex items-center gap-2">
                                📚 {{ curso.modulos.length }} módulos
                            </span>
                            <span class="flex items-center gap-2">
                                🎓 Certificación incluida
                            </span>
                        </div>
                    </div>
                </div>       

                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                    <div class="flex justify-between items-end mb-2">
                        <span class="font-bold text-slate-800">Tu Progreso</span>
                        <span class="text-sm font-bold text-slate-900">{{ porcentajeProgreso }}%</span>
                    </div>
                    <p class="text-sm text-slate-500 mb-3">Módulos completados: {{ modulosCompletados.length }} / {{ curso.modulos.length }}</p>
                    <div class="w-full bg-slate-100 rounded-full h-2.5">
                        <div class="bg-slate-800 h-2.5 rounded-full transition-all duration-500" :style="{ width: `${porcentajeProgreso}%` }"></div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div class="lg:col-span-2 space-y-6">
                        
                        <div class="bg-slate-200/50 p-1 rounded-xl flex gap-1 mb-6">
                            <button @click="tabActiva = 'contenido'" :class="tabActiva === 'contenido' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700'" class="flex-1 py-2.5 px-4 rounded-lg text-sm transition-all duration-200">
                                Contenido
                            </button>
                            <button @click="tabActiva = 'informacion'" :class="tabActiva === 'informacion' ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-700'" class="flex-1 py-2.5 px-4 rounded-lg text-sm transition-all duration-200">
                                Información
                            </button>
                        </div>

                        <div v-show="tabActiva === 'contenido'" class="space-y-6">
                            <div v-for="(modulo, index) in curso.modulos" :key="modulo.id" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                
                                <div class="flex items-center gap-3 mb-4">
                                    <span class="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">Módulo {{ index + 1 }}</span>
                                    <span v-if="modulo.duracion" class="text-sm text-slate-500">⏱️ {{ modulo.duracion }}</span>
                                </div>
                                
                                <h3 class="text-xl font-bold text-slate-900 mb-4">{{ modulo.titulo }}</h3>
                                
                                <p class="text-slate-600 whitespace-pre-wrap mb-6 leading-relaxed">{{ modulo.descripcion_contenido }}</p>

                                <div v-if="modulo.link_video" class="mb-6">
                                    <a :href="modulo.link_video" target="_blank" class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 px-4 py-2.5 rounded-xl font-medium transition text-sm">
                                        ▶ Ver Video de la Clase
                                    </a>
                                </div>

                                <div v-if="modulo.archivos && modulo.archivos.length > 0" class="mb-6">
                                    <h4 class="text-sm font-bold text-slate-800 mb-3">Recursos descargables:</h4>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <a v-for="archivo in modulo.archivos" :key="archivo.id" :href="`/storage/${archivo.ruta_archivo}`" target="_blank" class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition group">
                                            <span class="text-2xl">📄</span>
                                            <span class="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate">{{ archivo.nombre_archivo }}</span>
                                        </a>
                                    </div>
                                </div>

                                <button 
                                    @click="toggleCompletado(modulo.id)"
                                    :class="modulosCompletados.includes(modulo.id) ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-slate-900 text-white hover:bg-slate-800'"
                                    class="w-full py-3 rounded-xl font-medium transition border text-sm flex justify-center items-center gap-2">
                                    <span v-if="modulosCompletados.includes(modulo.id)">✓ Completado</span>
                                    <span v-else>▶ Marcar como completado</span>
                                </button>
                            </div>
                        </div>

                        <div v-show="tabActiva === 'informacion'" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 class="text-lg font-bold text-slate-900 mb-4">Sobre este curso</h3>
                            <p class="text-slate-600 mb-4">Instructor: Este curso fue creado por un experto.</p>
                            <p class="text-slate-600 mb-4">Requisitos: Ninguno, solo ganas de aprender.</p>
                        </div>
                        
                    </div>

                    <div>
                        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
                            <h3 class="text-lg font-bold text-slate-900 mb-6">Evaluación Final</h3>
                            
                            <div class="space-y-4 mb-6">
                                <div class="flex items-center gap-3 text-slate-600">
                                    <span class="font-bold text-slate-900">{{ curso.preguntas.length }}</span> preguntas
                                </div>
                                <div class="flex items-center gap-3 text-slate-600">
                                    Puntuación mínima: <span class="font-bold text-slate-900">{{ curso.exigencia_minima }}%</span>
                                </div>
                                <div class="flex items-center gap-3 text-slate-600">
                                    Tiempo: <span class="font-bold text-slate-900">Sin límite</span>
                                </div>
                                <div class="flex items-center gap-3 text-slate-600">
                                    Intentos: <span class="font-bold text-slate-900">{{ curso.max_intentos }}</span>
                                </div>
                            </div>

                            <div v-if="porcentajeProgreso < 100" class="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl mb-6 leading-relaxed">
                                Completa todos los módulos para desbloquear el examen.
                            </div>

                            <Link 
                                :href="route('alumno.examen.show', curso.id)"
                                as="button"
                                :disabled="porcentajeProgreso < 100"
                                :class="porcentajeProgreso === 100 ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-slate-300 text-slate-500 cursor-not-allowed'"
                                class="w-full py-3.5 rounded-xl font-bold transition flex justify-center items-center">
                                Realizar Examen
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
import { ref, computed } from 'vue';

const props = defineProps({
    curso: Object,
    progresoGuardado: {
        type: Array,
        default: () => []
    }
});

const tabActiva = ref('contenido');

const modulosCompletados = ref([...props.progresoGuardado]);

const porcentajeProgreso = computed(() => {
    if (!props.curso.modulos || props.curso.modulos.length === 0) return 0;
    return Math.round((modulosCompletados.value.length / props.curso.modulos.length) * 100);
});

const toggleCompletado = (moduloId) => {
    const index = modulosCompletados.value.indexOf(moduloId);
    if (index === -1) {
        modulosCompletados.value.push(moduloId); 
    } else {
        modulosCompletados.value.splice(index, 1); 
    }
};
</script>