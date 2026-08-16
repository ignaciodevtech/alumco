<template>
    <Head title="Mis Logros" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">Mis Logros y Certificados</h2>
        </template>

        <main class="max-w-6xl mx-auto py-8 px-4">
            
            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                
                <!-- Navegación de Pestañas (Tabs) -->
                <div class="flex border-b border-slate-200">
                    <button 
                        @click="activeTab = 'cursos'"
                        :class="[
                            'flex-1 py-4 px-6 text-center text-sm font-medium transition-colors',
                            activeTab === 'cursos' 
                                ? 'bg-slate-50 text-blue-600 border-b-2 border-blue-600' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        ]"
                    >
                        <div class="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Cursos Completados
                        </div>
                    </button>
                    
                    <button 
                        @click="activeTab = 'certificados'"
                        :class="[
                            'flex-1 py-4 px-6 text-center text-sm font-medium transition-colors',
                            activeTab === 'certificados' 
                                ? 'bg-slate-50 text-amber-600 border-b-2 border-amber-600' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        ]"
                    >
                        <div class="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Mis Certificados
                        </div>
                    </button>
                </div>

                <!-- Contenido de las Pestañas -->
                <div class="p-6 md:p-8">
                    
                    <!-- Vista: Cursos Completados -->
                    <div v-if="activeTab === 'cursos'">
                        <h3 class="text-lg font-bold text-slate-800 mb-6">Historial de Cursos</h3>
                        
                        <div v-if="cursos.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="curso in cursos" :key="curso.id" class="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                                <h4 class="font-semibold text-slate-900">{{ curso.titulo }}</h4>
                                <div class="mt-4 flex justify-between items-center text-sm text-slate-600">
                                    <span>Completado: {{ curso.fecha_termino }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-12 text-slate-500">
                            Aún no has completado ningún curso. ¡Sigue aprendiendo!
                        </div>
                    </div>

                    <!-- Vista: Certificados -->
                    <div v-if="activeTab === 'certificados'">
                        <h3 class="text-lg font-bold text-slate-800 mb-6">Certificados Disponibles</h3>
                        
                        <div v-if="certificados.length > 0" class="flex flex-col gap-4">
                            <div v-for="cert in certificados" :key="cert.id" class="flex items-center justify-between border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-slate-50">
                                <div>
                                    <h4 class="font-semibold text-slate-900">{{ cert.titulo }}</h4>
                                    <p class="text-sm text-slate-500 mt-1">Obtenido el {{ cert.fecha_obtencion }}</p>
                                </div>
                                
                                <a :href="cert.url_descarga" download class="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Descargar
                                </a>
                            </div>
                        </div>
                        <div v-else class="text-center py-12 text-slate-500">
                            Aún no tienes certificados.
                        </div>
                    </div>

                </div>
            </div>

        </main>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';

const activeTab = ref('cursos');

defineProps({
    cursos: Array,
    certificados: Array
});
</script>