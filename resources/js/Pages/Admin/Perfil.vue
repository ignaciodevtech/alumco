<template>
    <Head title="Mi Perfil" />

    <AuthenticatedLayout>
        <main class="max-w-6xl mx-auto py-8 px-4">
            
            <div class="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex items-center gap-6">
                <div class="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                    {{ inicialNombre }}
                </div>
                
                <div>
                    <h1 class="text-3xl font-bold text-slate-900 mb-2">{{ user.name }}</h1>
                    
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-4 text-sm">
                            <div class="flex items-center gap-1.5 text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {{ user.email }}
                            </div>
                            <span class="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase">
                                {{ user.rol }}
                            </span>
                        </div>

                        <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-1">
                            <div class="flex items-center gap-1.5">
                                <span class="font-semibold text-slate-700">Sexo:</span>
                                {{ user.sexo || 'No especificado' }}
                            </div>
                            <span class="text-slate-300">|</span>
                            <div class="flex items-center gap-1.5">
                                <span class="font-semibold text-slate-700">Nacimiento:</span>
                                {{ user.fecha_nacimiento || 'No especificada' }}
                            </div>
                            <span class="text-slate-300">|</span>
                            <div class="flex items-center gap-1.5">
                                <span class="font-semibold text-slate-700">Sede:</span>
                                {{ user.sede || 'No especificada' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const user = usePage().props.auth.user;

const inicialNombre = computed(() => {
    const nombre = user.name;
    return nombre ? nombre.charAt(0).toUpperCase() : 'A';
});
</script>