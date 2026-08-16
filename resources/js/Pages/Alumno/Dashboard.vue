<template>
    <Head title="Mis Cursos" />

    <AuthenticatedLayout>
        <div class="py-12 bg-slate-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div class="flex justify-between items-center mb-8">
                    <div>
                        <h1 class="text-3xl font-extrabold text-slate-900">Mis Cursos</h1>
                        <p class="text-slate-600">Continúa donde lo dejaste.</p>
                    </div>
                    <Link :href="route('alumno.explorar')" class="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                        Explorar más cursos &rarr;
                    </Link>
                </div>

                <div v-if="misCursos && misCursos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    <div v-for="curso in misCursos" :key="curso.id" 
                         class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        
                        <div class="h-40 w-full bg-slate-100 relative">
                            <img v-if="curso.imagen_portada" 
                                 :src="`/storage/${curso.imagen_portada}`" 
                                 class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                <span class="text-xs uppercase font-bold tracking-widest">Sin Portada</span>
                            </div>
                            
                            <div v-if="curso.pivot && curso.pivot.estado" class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-700 shadow-sm uppercase">
                                {{ curso.pivot.estado }}
                            </div>
                        </div>

                        <div class="p-6 flex-1 flex flex-col">
                            <h3 class="text-xl font-bold text-slate-800 mb-2">{{ curso.titulo }}</h3>
                            
                            <!-- Barra de progreso dinámica -->
                            <div class="w-full bg-slate-100 h-1.5 rounded-full mb-6 mt-2 overflow-hidden">
                                <div class="bg-blue-500 h-full transition-all duration-500" 
                                     :style="{ width: (curso.pivot && curso.pivot.estado && curso.pivot.estado.toLowerCase() === 'completado') ? '100%' : (curso.progreso ? `${curso.progreso}%` : '33%') }">
                                </div>
                            </div>

                            <Link 
                                :href="route('alumno.cursos.show', curso.id)" 
                                class="block w-full text-center py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition mt-auto">
                                Ingresar al Curso
                            </Link>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div class="text-slate-400 mb-4 text-5xl">📚</div>
                    <h3 class="text-xl font-bold text-slate-800">Aún no estás inscrito en ningún curso</h3>
                    <p class="text-slate-500 mb-8">¡Explora nuestro catálogo y comienza a aprender hoy mismo!</p>
                    <Link :href="route('alumno.explorar')" class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                        Ir al Catálogo
                    </Link>
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3'; 

defineProps({
    misCursos: Array
});
</script>