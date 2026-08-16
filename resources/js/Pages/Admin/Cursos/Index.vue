<template>
    <Head title="Catálogo de Cursos" />

    <AuthenticatedLayout>
        <div class="py-8">
            <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
                
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800">Catálogo de Cursos</h2>
                        <p class="text-slate-500 text-sm">Explora y administra los cursos de la plataforma.</p>
                    </div>
                    <Link :href="route('admin.cursos.create')" class="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
                        <span>+</span> Crear Nuevo Curso
                    </Link>
                </div>

                <div class="mb-8">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg class="w-5 h-5 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" v-model="busqueda" class="block w-full p-4 pl-10 text-sm text-slate-900 border border-slate-200 rounded-xl bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm" placeholder="Buscar cursos por título...">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <div v-if="cursosFiltrados.length === 0" class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <p class="text-slate-500 font-medium">No se encontraron cursos con esos datos.</p>
                    </div>

                    <div v-for="curso in cursosFiltrados" :key="curso.id" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
                        
                        <div class="h-48 w-full bg-slate-100 relative">
                            <img v-if="curso.imagen_portada" :src="`/storage/${curso.imagen_portada}`" :alt="curso.titulo" class="w-full h-full object-cover">
                            <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            
                            <div class="absolute top-3 right-3">
                                <span v-if="curso.estado === 'borrador'" class="px-3 py-1 bg-amber-100/90 backdrop-blur text-amber-800 rounded-full text-xs font-bold shadow-sm">
                                    Borrador
                                </span>
                                <span v-else class="px-3 py-1 bg-emerald-100/90 backdrop-blur text-emerald-800 rounded-full text-xs font-bold shadow-sm">
                                    Publicado
                                </span>
                            </div>
                        </div>

                        <div class="p-5 flex-1 flex flex-col">
                            <h3 class="font-bold text-lg text-slate-900 mb-2 line-clamp-2">{{ curso.titulo }}</h3>
                            <p class="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">{{ curso.descripcion }}</p>
                            
                            <div class="flex items-center gap-4 text-xs font-medium text-slate-500 mb-5">
                                <div class="flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Exigencia: {{ curso.exigencia_minima }}%
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Módulos
                                </div>
                            </div>

                            <Link :href="route('admin.cursos.edit', curso.id)" class="block w-full text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors">
                                Gestionar Curso
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
    cursos: Array
});


const busqueda = ref('');


const cursosFiltrados = computed(() => {
    if (!busqueda.value) return props.cursos; 
    
    return props.cursos.filter(curso => 
        curso.titulo.toLowerCase().includes(busqueda.value.toLowerCase())
    );
});
</script>