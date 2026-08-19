<template>
    <AuthenticatedLayout>
        <div class="py-12 bg-slate-50 min-h-screen">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="mb-8">
                    <h1 class="text-3xl font-extrabold text-slate-900">Catálogo de Capacitación</h1>
                    <p class="text-slate-600">Encuentra tu próximo curso y potencia tus habilidades.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    <div v-for="curso in cursos" :key="curso.id" 
                         class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                        
                        <div class="h-48 w-full bg-slate-100 relative">
                            <img v-if="curso.imagen_portada" 
                                 :src="`/storage/${curso.imagen_portada}`" 
                                 :alt="curso.titulo"
                                 class="w-full h-full object-cover absolute inset-0" />
                            
                            <div v-else class="w-full h-full absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-50">
                                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        </div>

                        <div class="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 mb-2">{{ curso.titulo }}</h3>
                                <p class="text-slate-500 text-sm mb-6 line-clamp-3">{{ curso.descripcion }}</p>
                            </div>

                            <div class="mt-auto">
                                <div v-if="inscritos.includes(curso.id)" 
                                     class="w-full text-center py-2.5 bg-slate-100 text-slate-500 font-semibold rounded-xl">
                                    Ya estás participando
                                </div>

                                <Link v-else 
                                      :href="route('alumno.inscribir', curso.id)" 
                                      method="post" as="button"
                                      class="w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                                    Inscribirme ahora
                                </Link>
                            </div>
                        </div>
                    </div>
                    </div>

                <div v-if="cursos.length === 0" class="text-center py-12 text-gray-500 col-span-full">
                    Aún no hay cursos disponibles en la plataforma.
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({
    cursos: Array,
    inscritos: Array
});
</script>