<template>
    <Head :title="'Examen: ' + curso.titulo" />

    <AuthenticatedLayout>
        <div class="py-12 bg-slate-50 min-h-screen">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div v-if="fase === 'advertencia'" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mt-10">
                    <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        ⚠️
                    </div>
                    <h2 class="text-2xl font-bold text-slate-900 mb-4">¿Estás listo para comenzar?</h2>
                    <p class="text-slate-600 mb-6 text-lg">
                        Estás a punto de iniciar la evaluación final del curso <strong>{{ curso.titulo }}</strong>.
                    </p>
                    <div class="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-8 text-left">
                        <ul class="list-disc list-inside space-y-2">
                            <li>El examen consta de <strong>{{ curso.preguntas.length }} preguntas</strong>.</li>
                            <li>Puntuación mínima para aprobar: <strong>{{ curso.exigencia_minima }}%</strong>.</li>
                            <li><strong>Importante:</strong> Una vez comenzado el examen, deberás terminarlo. No podrás guardar el progreso ni dejarlo a medias.</li>
                        </ul>
                    </div>
                    
                    <div class="flex gap-4 justify-center">
                        <Link :href="route('alumno.cursos.show', curso.id)" class="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">
                            Volver al Curso
                        </Link>
                        <button @click="comenzarExamen" class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md">
                            Comenzar Examen
                        </button>
                    </div>
                </div>

                <div v-else-if="fase === 'examen'">
                    
                    <div class="mb-6">
                        <button @click="intentarSalir" class="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition">
                            <span>&larr;</span> Volver al Curso
                        </button>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                        <div class="flex justify-between items-end mb-3">
                            <span class="font-bold text-slate-800">Pregunta {{ indiceActual + 1 }} de {{ curso.preguntas.length }}</span>
                            <span class="text-sm font-bold text-slate-900">{{ porcentajeProgreso }}%</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-2">
                            <div class="bg-slate-900 h-2 rounded-full transition-all duration-300" :style="{ width: `${porcentajeProgreso}%` }"></div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 min-h-[300px]">
                        <h3 class="font-bold text-slate-900 mb-2">Pregunta {{ indiceActual + 1 }}</h3>
                        <p class="text-slate-700 text-lg mb-8">{{ preguntaActual.texto_pregunta }}</p>

                        <div v-if="preguntaActual.tipo === 'multiple'" class="space-y-3">
                            <label v-for="(opcion, index) in preguntaActual.opciones" :key="index" 
                                :class="respuestas[preguntaActual.id] === opcion.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'"
                                class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition group">
                                
                                <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0"
                                    :class="respuestas[preguntaActual.id] === opcion.id ? 'border-slate-900' : 'border-slate-300'">
                                    <div v-if="respuestas[preguntaActual.id] === opcion.id" class="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                                </div>
                                
                                <input type="radio" :name="`pregunta_${preguntaActual.id}`" :value="opcion.id" v-model="respuestas[preguntaActual.id]" class="hidden">
                                <span class="text-slate-700 font-medium group-hover:text-slate-900">{{ opcion.texto_opcion }}</span>
                            </label>
                        </div>

                        <div v-if="preguntaActual.tipo === 'vf'" class="space-y-3">
                            <label :class="respuestas[preguntaActual.id] === 'verdadero' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'" class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition group">
                                <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0" :class="respuestas[preguntaActual.id] === 'verdadero' ? 'border-slate-900' : 'border-slate-300'">
                                    <div v-if="respuestas[preguntaActual.id] === 'verdadero'" class="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                                </div>
                                <input type="radio" :name="`pregunta_${preguntaActual.id}`" value="verdadero" v-model="respuestas[preguntaActual.id]" class="hidden">
                                <span class="text-slate-700 font-medium">Verdadero</span>
                            </label>

                            <label :class="respuestas[preguntaActual.id] === 'falso' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'" class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition group">
                                <div class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0" :class="respuestas[preguntaActual.id] === 'falso' ? 'border-slate-900' : 'border-slate-300'">
                                    <div v-if="respuestas[preguntaActual.id] === 'falso'" class="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                                </div>
                                <input type="radio" :name="`pregunta_${preguntaActual.id}`" value="falso" v-model="respuestas[preguntaActual.id]" class="hidden">
                                <span class="text-slate-700 font-medium">Falso</span>
                            </label>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <button @click="irAnterior" :disabled="indiceActual === 0" :class="indiceActual === 0 ? 'opacity-0 cursor-default' : 'hover:bg-slate-100'" class="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 transition border border-slate-200 bg-white">
                            <span>&larr;</span> Anterior
                        </button>

                        <button v-if="indiceActual < curso.preguntas.length - 1" @click="irSiguiente" :disabled="!respuestas[preguntaActual.id]" :class="!respuestas[preguntaActual.id] ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'" class="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition shadow-sm">
                            Siguiente <span>&rarr;</span>
                        </button>
                        
                        <button v-else @click="finalizarExamen" :disabled="!respuestas[preguntaActual.id]" :class="!respuestas[preguntaActual.id] ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'" class="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition shadow-md">
                            Finalizar Examen <span>✓</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';

const props = defineProps({
    curso: Object
});

const fase = ref('advertencia');
const indiceActual = ref(0);
const respuestas = ref({});

const preguntaActual = computed(() => {
    return props.curso.preguntas[indiceActual.value];
});

const porcentajeProgreso = computed(() => {
    if (!props.curso.preguntas.length) return 0;
    return Math.round(((indiceActual.value + 1) / props.curso.preguntas.length) * 100);
});

const comenzarExamen = () => {
    fase.value = 'examen';
};

const intentarSalir = () => {
    if (confirm('¿Estás seguro de que deseas salir? Si abandonas el examen ahora, perderás todo tu progreso y contará como un intento fallido.')) {
        router.get(route('alumno.cursos.show', props.curso.id));
    }
};

const irAnterior = () => {
    if (indiceActual.value > 0) indiceActual.value--;
};

const irSiguiente = () => {
    if (indiceActual.value < props.curso.preguntas.length - 1) {
        indiceActual.value++;
    }
};

const finalizarExamen = () => {
    if (confirm('¿Estás seguro de enviar tus respuestas? Ya no podrás modificarlas.')) {
        router.post(route('alumno.examen.finalizar', props.curso.id), {
            respuestas: respuestas.value
        }, {
            onFinish: () => {
            }
        });
    }
};
</script>