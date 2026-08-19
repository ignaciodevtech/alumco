<template>
    <AuthenticatedLayout>
        <div class="p-8 max-w-7xl mx-auto">
            <div class="flex justify-between items-end mb-8">
                <div>
                    <h2 class="text-3xl font-extrabold text-slate-900">Estadísticas de la Plataforma</h2>
                    <p class="text-slate-600 mt-1">Análisis demográfico de tus {{ totalUsuarios }} usuarios registrados.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- grafico usuarios por rol-->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 class="text-lg font-bold text-slate-800 mb-6">Distribución por Rol</h3>
                    <div class="space-y-4">
                        <div v-for="item in porRol" :key="item.rol">
                            <div class="flex justify-between text-sm font-semibold mb-1">
                                <span class="capitalize text-slate-700">{{ item.rol }}</span>
                                <span class="text-blue-600">{{ item.total }} ({{ calcularPorcentaje(item.total) }}%)</span>
                            </div>
                            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                                     :style="`width: ${calcularPorcentaje(item.total)}%`"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- grafico usuarios por sexo -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 class="text-lg font-bold text-slate-800 mb-6">Distribución por Sexo</h3>
                    <div class="space-y-4">
                        <div v-for="item in porSexo" :key="item.sexo">
                            <div class="flex justify-between text-sm font-semibold mb-1">
                                <span class="capitalize text-slate-700">{{ item.sexo }}</span>
                                <span class="text-emerald-600">{{ item.total }} ({{ calcularPorcentaje(item.total) }}%)</span>
                            </div>
                            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                                     :style="`width: ${calcularPorcentaje(item.total)}%`"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- grafico usuarios por sede-->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 class="text-lg font-bold text-slate-800 mb-6">Distribución por Sede</h3>
                    <div class="space-y-4">
                        <div v-for="item in porSede" :key="item.sede">
                            <div class="flex justify-between text-sm font-semibold mb-1">
                                <span class="capitalize text-slate-700">{{ item.sede }}</span>
                                <span class="text-orange-600">{{ item.total }} ({{ calcularPorcentaje(item.total) }}%)</span>
                            </div>
                            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-orange-500 h-full rounded-full transition-all duration-1000" 
                                     :style="`width: ${calcularPorcentaje(item.total)}%`"></div>
                            </div>
                        </div>
                        
                        <!-- Mensaje por si no hay sedes registradas aún -->
                        <div v-if="porSede.length === 0" class="text-center text-slate-500 text-sm py-4">
                            No hay datos de sedes registrados.
                        </div>
                    </div>
                </div>

                <!-- grafico usuarios por rango de edad -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
                    <h3 class="text-lg font-bold text-slate-800 mb-6">Distribución por Rango de Edad</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div v-for="item in porEdad" :key="item.rango" class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 class="text-slate-500 text-sm font-semibold mb-2">{{ item.rango }}</h4>
                            <div class="flex items-end gap-2 mb-3">
                                <span class="text-3xl font-black text-slate-800">{{ item.total }}</span>
                                <span class="text-sm text-slate-500 font-medium mb-1 pl-1">usuarios</span>
                            </div>
                            <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div class="bg-indigo-500 h-full rounded-full" 
                                     :style="`width: ${calcularPorcentaje(item.total)}%`"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

const props = defineProps({
    totalUsuarios: Number,
    porRol: Array,
    porSexo: Array,
    porEdad: Array,
    porSede: Array
});

const calcularPorcentaje = (cantidad) => {
    if (props.totalUsuarios === 0) return 0;
    return Math.round((cantidad / props.totalUsuarios) * 100);
};
</script>