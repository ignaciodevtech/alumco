<template>
    <AuthenticatedLayout>
        <div class="p-8 max-w-7xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Gestión de Alumnos</h2>

            <div class="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <input v-model="buscar" type="text" placeholder="Buscar alumno..." class="flex-1 border-slate-300 rounded-lg">
                
                <div class="flex gap-2 items-center">
                    <select v-model="cursoSeleccionado" class="border-slate-300 rounded-lg text-sm">
                        <option value="">Seleccionar curso...</option>
                        <option v-for="curso in cursos" :key="curso.id" :value="curso.id">{{ curso.titulo }}</option>
                    </select>
                    <button @click="procesarMasivo('inscribir')" :disabled="!puedeActuar" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">Inscribir</button>
                    <button @click="procesarMasivo('desinscribir')" :disabled="!puedeActuar" class="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm disabled:opacity-50">Desvincular</button>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="p-4 w-10"><input type="checkbox" @change="toggleTodos" :checked="todosSeleccionados"></th>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Nombre</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Sexo</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Edad</th>
                           <th class="p-4 font-semibold text-slate-700 text-sm">Sede</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Rol</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="user in usuarios" :key="user.id" :class="seleccionados.includes(user.id) ? 'bg-blue-50/50' : ''">
                            <td class="p-4"><input type="checkbox" v-model="seleccionados" :value="user.id"></td>
                            <td class="p-4 text-sm text-slate-800">{{ user.name }}</td>
                            <td class="p-4 text-sm text-slate-600">{{ user.sexo }}</td>
                            <td class="p-4 text-sm text-slate-600">{{ user.edad }} años</td>
                            <td class="p-4 text-sm font-medium text-slate-700">{{ user.sede || 'Sin sede' }}</td>
                            
                            <!-- Nuevo selector de Rol -->
                            <td class="p-4 text-sm text-slate-600">
                                <select 
                                    v-model="user.rol" 
                                    @change="cambiarRol(user.id, user.rol)"
                                    class="border-slate-300 rounded-md text-sm py-1 pl-2 pr-8 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="alumno">Alumno</option>
                                    <option value="profesor">Profesor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </td>

                            <td class="p-4 text-right">
                                <Link :href="route('admin.alumnos.show', user.id)" class="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-50 px-3 py-1.5 rounded-lg transition">
                                    Ver Perfil
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

const props = defineProps({ usuarios: Array, cursos: Array, filtros: Object });

const buscar = ref(props.filtros.buscar || '');
const seleccionados = ref([]);
const cursoSeleccionado = ref('');

const puedeActuar = computed(() => seleccionados.value.length > 0 && cursoSeleccionado.value !== '');
const todosSeleccionados = computed(() => seleccionados.value.length === props.usuarios.length && props.usuarios.length > 0);

const toggleTodos = (e) => seleccionados.value = e.target.checked ? props.usuarios.map(u => u.id) : [];

watch(buscar, (val) => {
    router.get(route('admin.alumnos.index'), { buscar: val }, { preserveState: true, replace: true });
});

const procesarMasivo = (accion) => {
    if (confirm(`¿Deseas ${accion} a los ${seleccionados.value.length} alumnos seleccionados?`)) {
        router.post(route('admin.alumnos.masivo'), {
            user_ids: seleccionados.value,
            curso_id: cursoSeleccionado.value,
            accion: accion
        }, {
            onSuccess: () => {
                seleccionados.value = [];
                alert('¡Acción realizada!');
            }
        });
    }
};

const cambiarRol = (usuarioId, nuevoRol) => {
    router.put(route('admin.usuarios.actualizar-rol', usuarioId), {
        rol: nuevoRol
    }, {
        preserveScroll: true,
        onSuccess: () => alert('¡Rol actualizado con éxito!')
    });
};
</script>