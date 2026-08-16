<template>
    <AuthenticatedLayout>
        <div class="p-8 max-w-7xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Plantilla Docente</h2>

            <div class="mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <input v-model="buscar" type="text" placeholder="Buscar profesor por nombre..." class="w-full md:w-1/2 border-slate-300 rounded-lg">
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Nombre</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Email</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Sexo / Edad</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Sede</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm">Rol</th>
                            <th class="p-4 font-semibold text-slate-700 text-sm text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="user in usuarios" :key="user.id" class="hover:bg-slate-50 transition">
                            <td class="p-4 text-sm font-medium text-slate-800">{{ user.name }}</td>
                            <td class="p-4 text-sm text-slate-600">{{ user.email }}</td>
                            <td class="p-4 text-sm text-slate-600">{{ user.sexo }} • {{ user.edad }} años</td>
                            <td class="p-4 text-sm font-medium text-slate-700">{{ user.sede || 'Sin sede' }}</td>
                            
                            <!-- Selector de Rol idéntico al de alumnos -->
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
                                <Link :href="route('admin.profesores.show', user.id)" class="text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-50 px-3 py-1.5 rounded-lg transition">
                                    Ver Perfil
                                </Link>
                            </td>
                        </tr>
                        <tr v-if="usuarios.length === 0">
                            <td colspan="5" class="p-8 text-center text-slate-500">No se encontraron profesores.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

const props = defineProps({ usuarios: Array, filtros: Object });
const buscar = ref(props.filtros.buscar || '');

watch(buscar, (val) => {
    router.get(route('admin.profesores.index'), { buscar: val }, { preserveState: true, replace: true });
});

const cambiarRol = (usuarioId, nuevoRol) => {
    router.put(route('admin.usuarios.actualizar-rol', usuarioId), {
        rol: nuevoRol
    }, {
        preserveScroll: true,
        onSuccess: () => alert('¡Rol actualizado con éxito!')
    });
};
</script>