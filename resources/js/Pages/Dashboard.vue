<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <div class="py-8">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-slate-800">
                        ¡Hola de nuevo, {{ $page.props.auth.user.name }}! 👋
                    </h2>
                    <p class="text-slate-500">Aquí tienes un resumen de lo que está pasando en Alumco hoy.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition">
                        <div class="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-slate-500">Total Alumnos</p>
                            <p class="text-2xl font-bold text-slate-900">{{ stats.alumnos }}</p>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition">
                        <div class="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-slate-500">Profesores Activos</p>
                            <p class="text-2xl font-bold text-slate-900">{{ stats.profesores }}</p>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md transition">
                        <div class="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-slate-500">Cursos Publicados</p>
                            <p class="text-2xl font-bold text-slate-900">{{ stats.cursos }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 class="font-bold text-slate-800">Últimos Alumnos Registrados</h3>
                        <button class="text-sm text-blue-600 font-medium hover:text-blue-800">Ver todos</button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-white text-slate-500 text-sm border-b border-slate-200">
                                    <th class="px-6 py-4 font-medium">Nombre</th>
                                    <th class="px-6 py-4 font-medium">Correo Electrónico</th>
                                    <th class="px-6 py-4 font-medium">Fecha de Registro</th>
                                    <th class="px-6 py-4 font-medium text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-for="alumno in ultimosAlumnos" :key="alumno.id" class="hover:bg-slate-50 transition">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                {{ alumno.nombre.charAt(0) }}
                                            </div>
                                            <span class="font-medium text-slate-800">{{ alumno.nombre }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-slate-600">{{ alumno.email }}</td>
                                    <td class="px-6 py-4 text-slate-500 text-sm">{{ alumno.fecha }}</td>
                                    <td class="px-6 py-4 text-right">
                                        <button class="text-slate-400 hover:text-blue-600 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref } from 'vue';

const stats = ref({
    alumnos: 142,
    profesores: 18,
    cursos: 24
});

const ultimosAlumnos = ref([
    { id: 1, nombre: 'María González', email: 'maria.g@email.com', fecha: 'Hoy, 10:30 AM' },
    { id: 2, nombre: 'Carlos Silva', email: 'csilva88@email.com', fecha: 'Ayer, 15:45 PM' },
    { id: 3, nombre: 'Valentina Soto', email: 'val.soto@email.com', fecha: '08 Abr 2026' },
    { id: 4, nombre: 'Diego Aránguiz', email: 'daranguiz@email.com', fecha: '07 Abr 2026' },
]);
</script>