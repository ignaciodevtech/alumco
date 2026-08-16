<template>
    <AuthenticatedLayout>
        <div class="p-8 max-w-5xl mx-auto">
            
            <div class="mb-6">
                <Link :href="route('admin.alumnos.index')" class="text-sm font-medium text-slate-500 hover:text-slate-800 transition">
                    &larr; Volver a Alumnos
                </Link>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
                <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-500 shrink-0">
                    {{ alumno.name.charAt(0) }}
                </div>
                <div>
                    <h2 class="text-3xl font-bold text-slate-800 mb-2">{{ alumno.name }}</h2>
                    <div class="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span class="flex items-center gap-1">📧 {{ alumno.email }}</span>
                        <span class="flex items-center gap-1">👤 {{ alumno.sexo || 'No definido' }}</span>
                        <span class="flex items-center gap-1">🎂 {{ alumno.edad }} años</span>
                    </div>
                </div>
            </div>

            <h3 class="text-xl font-bold text-slate-800 mb-4">Cursos inscritos ({{ alumno.cursos_inscritos.length }})</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="curso in alumno.cursos_inscritos" :key="curso.id" class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow transition">
                    <h4 class="font-bold text-slate-800 text-lg mb-2">{{ curso.titulo }}</h4>
                    <p class="text-sm text-slate-500 line-clamp-2 mb-4">{{ curso.descripcion }}</p>
                    <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-bold">
                        Inscrito
                    </span>
                </div>

                <div v-if="alumno.cursos_inscritos.length === 0" class="col-span-2 text-center py-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-500">
                    Este alumno no está inscrito en ningún curso actualmente.
                </div>
            </div>

        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({ alumno: Object });
</script>