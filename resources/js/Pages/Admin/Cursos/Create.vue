<template>
    <Head title="Crear Nuevo Curso" />

    <AuthenticatedLayout>
        <div class="py-8">
            <div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
                
                <div class="mb-6 flex items-center gap-4">
                    <Link :href="$page.props.auth.user.rol === 'admin' ? route('admin.cursos.index') : route('profesor.cursos.index')" class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                        <span>&larr;</span> Volver
                    </Link>
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800">Crear Nuevo Curso</h2>
                        <p class="text-slate-500 text-sm">Completa la información del curso, módulos y examen</p>
                    </div>
                </div>

                <div class="bg-slate-100 p-1 rounded-xl flex gap-1 mb-6">
                    <button type="button" @click="tabActiva = 1" :class="tabActiva === 1 ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700'" class="flex-1 py-2.5 px-4 rounded-lg text-sm transition-all duration-200">
                        Información General
                    </button>
                    <button type="button" @click="tabActiva = 2" :class="tabActiva === 2 ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700'" class="flex-1 py-2.5 px-4 rounded-lg text-sm transition-all duration-200">
                        Módulos y Contenido
                    </button>
                    <button type="button" @click="tabActiva = 3" :class="tabActiva === 3 ? 'bg-white shadow-sm text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700'" class="flex-1 py-2.5 px-4 rounded-lg text-sm transition-all duration-200">
                        Examen Final
                    </button>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <form @submit.prevent="submit" class="p-8">
                        
                        <div v-show="tabActiva === 1">
                            <div class="mb-6">
                                <h3 class="text-lg font-bold text-slate-800">Información del Curso</h3>
                                <p class="text-sm text-slate-500">Datos básicos que verán los estudiantes</p>
                            </div>

                            <div class="mb-6">
                                <label class="block text-sm font-medium text-slate-700 mb-2">Título del Curso</label>
                                <input type="text" v-model="form.titulo" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg shadow-sm" placeholder="Escriba aqui el título de su capacitación" />
                            </div>

                            <div class="mb-6">
                                <label class="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                                <textarea v-model="form.descripcion" rows="4" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg shadow-sm" placeholder="Describe de qué trata el curso y qué aprenderán los estudiantes..."></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Imagen del Curso (Portada)</label>
                                    <div class="w-full bg-slate-50 border border-slate-200 border-dashed rounded-lg p-4 flex items-center justify-center">
                                        <input type="file" @change="manejarSubidaImagen" accept="image/*" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Certificado de Aprobación</label>
                                    <div class="w-full bg-slate-50 border border-slate-200 border-dashed rounded-lg p-4 flex items-center justify-center">
                                        <input type="file" @change="manejarSubidaCertificado" accept=".pdf,image/*" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer" />
                                    </div>
                                    <p class="text-xs text-slate-500 mt-2">Sube el PDF o Imagen que se entregará al alumno cuando apruebe.</p>
                                </div>
                            </div>
                        </div>

                        <div v-show="tabActiva === 2">
                            <div class="mb-6">
                                <h3 class="text-lg font-bold text-slate-800">Módulos del Curso</h3>
                                <p class="text-sm text-slate-500">Agrega el contenido, videos y documentos descargables.</p>
                            </div>

                            <div v-for="(modulo, index) in form.modulos" :key="index" class="mb-6 p-6 border border-slate-200 rounded-xl bg-white relative">
                                <button type="button" @click="eliminarModulo(index)" class="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium" v-if="form.modulos.length > 1">
                                    Eliminar
                                </button>
                                
                                <h4 class="font-bold text-slate-800 mb-4">Módulo {{ index + 1 }}</h4>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Título del Módulo</label>
                                    <input type="text" v-model="modulo.titulo" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg" placeholder="Escriba aqui el título de su módulo" />
                                </div>

                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Contenido (Texto)</label>
                                    <textarea v-model="modulo.contenido" rows="3" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg" placeholder="Escribe el contenido del módulo aquí..."></textarea>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Duración (Opcional)</label>
                                        <input type="text" v-model="modulo.duracion" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg" placeholder="Ej: 60 min" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Enlace al Video (Drive/YouTube)</label>
                                        <input type="url" v-model="modulo.link_video" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg" placeholder="https://drive.google.com/..." />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Archivos y Recursos</label>
                                    <input type="file" multiple @change="(e) => manejarArchivosModulo(e, index)" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer" />
                                    <p class="text-xs text-slate-400 mt-1">Puedes seleccionar múltiples archivos (PDF, Word, Excel).</p>
                                </div>
                            </div>

                            <button type="button" @click="agregarModulo" class="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-slate-400 hover:bg-slate-50 transition flex justify-center items-center gap-2">
                                <span>+</span> Agregar Módulo
                            </button>
                        </div>

                        <div v-show="tabActiva === 3">
                            <div class="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                                <h3 class="text-lg font-bold text-slate-800 mb-4">Configuración del Examen</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Puntuación Mínima para Aprobar (%)</label>
                                        <input type="number" v-model="form.exigencia_minima" min="1" max="100" class="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500" placeholder="70" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Intentos Permitidos</label>
                                        <input type="number" v-model="form.max_intentos" min="1" class="w-full border-slate-300 rounded-lg shadow-sm focus:border-blue-500" placeholder="2" />
                                    </div>
                                </div>
                            </div>

                            <div v-for="(pregunta, index) in form.preguntas" :key="index" class="mb-6 p-6 border border-slate-200 rounded-xl bg-white relative">
                                <button type="button" @click="eliminarPregunta(index)" class="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium" v-if="form.preguntas.length > 1">
                                    Eliminar
                                </button>
                                
                                <div class="flex items-center gap-4 mb-4">
                                    <h4 class="font-bold text-slate-800">Pregunta {{ index + 1 }}</h4>
                                    <select v-model="pregunta.tipo" class="text-sm border-slate-300 rounded-lg py-1.5 pl-3 pr-10 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-500 cursor-pointer">
                                        <option value="multiple">Selección Múltiple</option>
                                        <option value="vf">Verdadero o Falso</option>
                                    </select>
                                </div>

                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Enunciado</label>
                                    <textarea v-model="pregunta.texto" rows="2" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg" placeholder="Escribe tu pregunta aquí..."></textarea>
                                </div>

                                <div v-if="pregunta.tipo === 'multiple'">
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Opciones (Marca el círculo de la correcta)</label>
                                    <div class="space-y-3">
                                        <div v-for="(opcion, opIndex) in pregunta.opciones" :key="opIndex" class="flex items-center gap-3">
                                            <input type="radio" :name="`pregunta_${index}`" :checked="opcion.es_correcta" @change="marcarCorrectaMultiple(index, opIndex)" class="text-blue-600 focus:ring-blue-500 w-5 h-5" />
                                            <input type="text" v-model="opcion.texto" class="flex-1 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg" :placeholder="`Opción ${opIndex + 1}`" />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="pregunta.tipo === 'vf'" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Respuesta Correcta</label>
                                        <div class="flex items-center gap-6">
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" v-model="pregunta.respuesta_vf" :value="true" :name="`vf_${index}`" class="text-blue-600 focus:ring-blue-500 w-5 h-5" />
                                                <span>Verdadero</span>
                                            </label>
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" v-model="pregunta.respuesta_vf" :value="false" :name="`vf_${index}`" class="text-blue-600 focus:ring-blue-500 w-5 h-5" />
                                                <span>Falso</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <button type="button" @click="agregarPregunta" class="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium hover:border-slate-400 hover:bg-slate-50 transition flex justify-center items-center gap-2">
                                <span>+</span> Agregar Pregunta
                            </button>
                        </div>

                        <div class="flex items-center justify-between border-t border-slate-200 mt-8 pt-6">
                            <button type="button" @click="guardarCurso('borrador')" class="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                                Guardar Borrador
                            </button>
                            
                            <button type="button" @click="guardarCurso('publicado')" class="flex items-center gap-2 bg-slate-900 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition shadow-sm">
                                Publicar Curso
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

const tabActiva = ref(1);

const form = useForm({
    titulo: '',
    descripcion: '',
    imagen_portada: null,
    archivo_certificado: null, 
    exigencia_minima: 70,
    max_intentos: 2,
    estado: 'borrador',
    
    modulos: [
        { titulo: '', contenido: '', duracion: '', link_video: '', archivos_nuevos: [] } 
    ],
    
    preguntas: [
        { 
            tipo: 'multiple', 
            texto: '', 
            opciones: [
                { texto: '', es_correcta: true },
                { texto: '', es_correcta: false },
                { texto: '', es_correcta: false },
                { texto: '', es_correcta: false }
            ],
            respuesta_vf: true
        }
    ]
});

const manejarSubidaImagen = (event) => {
    form.imagen_portada = event.target.files[0];
};

const manejarSubidaCertificado = (event) => {
    form.archivo_certificado = event.target.files[0];
};

const manejarArchivosModulo = (event, index) => {
    form.modulos[index].archivos_nuevos = Array.from(event.target.files);
};


const agregarModulo = () => {
    form.modulos.push({ titulo: '', contenido: '', duracion: '', link_video: '', archivos_nuevos: [] });
};

const eliminarModulo = (index) => {
    form.modulos.splice(index, 1);
};

// Funciones para preguntas del examen
const agregarPregunta = () => {
    form.preguntas.push({
        tipo: 'multiple',
        texto: '',
        opciones: [
            { texto: '', es_correcta: true },
            { texto: '', es_correcta: false },
            { texto: '', es_correcta: false },
            { texto: '', es_correcta: false }
        ],
        respuesta_vf: true
    });
};

const eliminarPregunta = (index) => {
    form.preguntas.splice(index, 1);
};

const marcarCorrectaMultiple = (preguntaIndex, opcionIndex) => {
    form.preguntas[preguntaIndex].opciones.forEach((opcion, i) => {
        opcion.es_correcta = (i === opcionIndex);
    });
};

const guardarCurso = (estadoSeleccionado) => {
    form.estado = estadoSeleccionado;
    form.post(route('admin.cursos.store'), {
        preserveScroll: true,
        forceFormData: true, 
        onSuccess: () => {
            alert(`¡El curso fue guardado exitosamente como ${estadoSeleccionado}!`);
        },
        onError: (errors) => {
            console.error("Hubo un error al guardar:", errors);
            alert("Revisa la consola, faltan datos o hubo un error.");
        }
    });
};
</script>