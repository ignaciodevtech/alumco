<template>
    <AuthenticatedLayout>
        <div class="p-8 max-w-5xl mx-auto">
            
            <div class="mb-6">
                <Link :href="route('admin.profesores.index')" class="text-sm font-medium text-slate-500 hover:text-slate-800 transition">
                    &larr; Volver a Profesores
                </Link>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
                <div class="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400 shrink-0">
                    {{ profesor.name.charAt(0) }}
                </div>
                <div>
                    <h2 class="text-3xl font-bold text-slate-800 mb-2">{{ profesor.name }}</h2>
                    <div class="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span class="flex items-center gap-1">📧 {{ profesor.email }}</span>
                        <span class="flex items-center gap-1">👤 {{ profesor.sexo || 'No definido' }}</span>
                        <span class="flex items-center gap-1">🎂 {{ profesor.edad }} años</span>
                    </div>
                </div>
            </div>

            <h3 class="text-xl font-bold text-slate-800 mb-4">Cursos de este profesor ({{ profesor.cursos.length }})</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="curso in profesor.cursos" :key="curso.id" class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow transition flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-bold text-slate-800 text-lg">{{ curso.titulo }}</h4>
                            <span :class="curso.estado === 'publicado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'" class="text-xs px-2 py-1 rounded-full font-bold uppercase">
                                {{ curso.estado }}
                            </span>
                        </div>
                        <p class="text-sm text-slate-500 line-clamp-2 mb-4">{{ curso.descripcion }}</p>
                    </div>
                    <Link :href="route('admin.cursos.edit', curso.id)" class="text-blue-600 text-sm font-bold hover:underline">
                        Administrar este curso &rarr;
                    </Link>
                </div>

                <div v-if="profesor.cursos.length === 0" class="col-span-2 text-center py-12 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-500">
                    Este profesor aún no ha creado ningún curso.
                </div>
            </div>

        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Link } from '@inertiajs/vue3';

defineProps({ profesor: Object });
</script>