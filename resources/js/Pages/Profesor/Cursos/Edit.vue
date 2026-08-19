<template>
    <Head title="Editar Curso" />

    <AuthenticatedLayout>
        <div class="py-8">
            <div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
                
                <div class="mb-6 flex items-center gap-4">
                    <Link :href="route('profesor.cursos.index')" class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                        <span>&larr;</span> Volver
                    </Link>
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800">Editar Curso</h2>
                        <p class="text-slate-500 text-sm">Modifica la información, sube nuevos archivos o actualiza el examen.</p>
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
                                <label class="block text-sm font-medium text-slate-700 mb-2">Título del Curso</label>
                                <input type="text" v-model="form.titulo" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg" />
                            </div>

                            <div class="mb-6">
                                <label class="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                                <textarea v-model="form.descripcion" rows="4" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg"></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-4">Imagen de Portada</label>
                                    <div v-if="curso.imagen_portada" class="mb-4">
                                        <p class="text-xs font-bold text-slate-500 uppercase mb-2">Portada Actual:</p>
                                        <img :src="`/storage/${curso.imagen_portada}`" class="h-40 w-auto rounded-lg shadow border border-slate-200 object-cover" />
                                    </div>
                                    <div class="w-full bg-slate-50 border border-slate-200 border-dashed rounded-lg p-4">
                                        <p class="text-xs text-slate-500 mb-2">Sube una nueva foto si quieres reemplazar la actual:</p>
                                        <input type="file" @change="manejarSubidaImagen" accept="image/*" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-slate-700 mb-4">Certificado de Aprobación</label>
                                    <div v-if="curso.archivo_certificado" class="mb-4">
                                        <p class="text-xs font-bold text-slate-500 uppercase mb-2">Certificado Actual:</p>
                                        <a :href="`/storage/${curso.archivo_certificado}`" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition font-bold text-sm">
                                            <span>📄</span> Ver Certificado Actual
                                        </a>
                                    </div>
                                    <div class="w-full bg-slate-50 border border-slate-200 border-dashed rounded-lg p-4">
                                        <p class="text-xs text-slate-500 mb-2">Sube un nuevo PDF o Imagen para reemplazar el actual:</p>
                                        <input type="file" @change="manejarSubidaCertificado" accept=".pdf,image/*" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-show="tabActiva === 2">
                            <div v-for="(modulo, index) in form.modulos" :key="index" class="mb-6 p-6 border border-slate-200 rounded-xl bg-white relative">
                                <button type="button" @click="eliminarModulo(index)" class="absolute top-4 right-4 text-red-500 text-sm font-medium">Eliminar</button>
                                
                                <h4 class="font-bold text-slate-800 mb-4">Módulo {{ index + 1 }}</h4>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Título del Módulo</label>
                                    <input type="text" v-model="modulo.titulo" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg" />
                                </div>

                                <div class="mb-4">
                                    <label class="block text-sm font-medium text-slate-700 mb-2">Contenido</label>
                                    <textarea v-model="modulo.contenido" rows="3" class="w-full bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg"></textarea>
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

                                <div v-if="modulo.archivos_existentes && modulo.archivos_existentes.length > 0" class="mb-4">
                                    <p class="text-xs font-bold text-slate-500 uppercase mb-2">Archivos ya subidos:</p>
                                    <div class="space-y-2">
                                        <div v-for="(file, fileIndex) in modulo.archivos_existentes" :key="file.id" class="flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-100">
                                            <span class="text-sm text-blue-700 flex items-center gap-2 truncate">
                                                📄 {{ file.nombre_archivo }}
                                            </span>
                                            <div class="flex items-center gap-3 ml-4 shrink-0">
                                                <a :href="`/storage/${file.ruta_archivo}`" target="_blank" class="text-xs text-blue-600 hover:text-blue-800 underline font-bold transition">Ver</a>
                                                <button type="button" @click="borrarArchivoGuardado(file.id, index, fileIndex)" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition text-xs font-bold" title="Eliminar archivo">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Subir archivos nuevos a este módulo</label>
                                    <input type="file" @change="(e) => manejarArchivosModulo(e, index)" multiple class="block w-full text-sm text-slate-500 file:bg-slate-100 file:text-slate-700 file:rounded-lg file:border-0 file:py-2 file:px-4" />
                                </div>
                            </div>
                            <button type="button" @click="agregarModulo" class="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium">+ Agregar Módulo</button>
                        </div>

                        <div v-show="tabActiva === 3">
                            <div class="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Puntuación para Aprobar (%)</label>
                                        <input type="number" v-model="form.exigencia_minima" class="w-full border-slate-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-slate-700 mb-2">Intentos Permitidos</label>
                                        <input type="number" v-model="form.max_intentos" class="w-full border-slate-300 rounded-lg" />
                                    </div>
                                </div>
                            </div>

                            <div v-for="(pregunta, index) in form.preguntas" :key="index" class="mb-6 p-6 border border-slate-200 rounded-xl bg-white relative">
                                <button type="button" @click="eliminarPregunta(index)" class="absolute top-4 right-4 text-red-500 text-sm">Eliminar</button>
                                
                                <div class="flex items-center gap-4 mb-4">
                                    <h4 class="font-bold text-slate-800">Pregunta {{ index + 1 }}</h4>
                                    <select v-model="pregunta.tipo" class="text-sm border-slate-300 rounded-lg py-1.5 pl-3 pr-10">
                                        <option value="multiple">Selección Múltiple</option>
                                        <option value="vf">Verdadero o Falso</option>
                                    </select>
                                </div>

                                <textarea v-model="pregunta.texto" rows="2" class="w-full bg-slate-50 border-transparent rounded-lg mb-4" placeholder="Enunciado..."></textarea>

                                <div v-if="pregunta.tipo === 'multiple'" class="space-y-3">
                                    <div v-for="(opcion, opIndex) in pregunta.opciones" :key="opIndex" class="flex items-center gap-3">
                                        <input type="radio" :name="`pregunta_${index}`" :checked="opcion.es_correcta" @change="marcarCorrectaMultiple(index, opIndex)" class="w-5 h-5 text-blue-600" />
                                        <input type="text" v-model="opcion.texto" class="flex-1 bg-slate-50 border-transparent rounded-lg" />
                                    </div>
                                </div>

                                <div v-if="pregunta.tipo === 'vf'" class="space-y-4">
                                    <div class="flex items-center gap-6">
                                        <label><input type="radio" v-model="pregunta.respuesta_vf" :value="true" :name="`vf_${index}`" /> Verdadero</label>
                                        <label><input type="radio" v-model="pregunta.respuesta_vf" :value="false" :name="`vf_${index}`" /> Falso</label>
                                    </div>
                                </div>
                            </div>
                            <button type="button" @click="agregarPregunta" class="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-medium">+ Agregar Pregunta</button>
                        </div>

                        <div class="flex items-center justify-between border-t border-slate-200 mt-8 pt-6">
                            <button type="button" @click="eliminarCurso" class="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium">
                                🗑️ Eliminar Curso
                            </button>
                            <div class="flex gap-4">
                                <button type="button" @click="guardarCurso('borrador')" class="bg-white border text-slate-700 px-6 py-2.5 rounded-lg font-medium">Guardar Borrador</button>
                                <button type="button" @click="guardarCurso('publicado')" class="bg-slate-900 text-white px-8 py-2.5 rounded-lg font-medium">Publicar Curso</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, useForm, router } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({ curso: Object });
const tabActiva = ref(1);

const formatearPreguntas = () => {
    if (!props.curso.preguntas || props.curso.preguntas.length === 0) return [{ tipo: 'multiple', texto: '', opciones: [{ texto: '', es_correcta: true }, { texto: '', es_correcta: false }, { texto: '', es_correcta: false }, { texto: '', es_correcta: false }], respuesta_vf: true }];
    return props.curso.preguntas.map(p => ({
        tipo: p.tipo, 
        texto: p.texto_pregunta, 
        respuesta_vf: p.respuesta_vf == 1,
        opciones: p.opciones && p.opciones.length > 0 ? p.opciones.map(o => ({ texto: o.texto_opcion, es_correcta: o.es_correcta === 1 })) : [{ texto: '', es_correcta: true }, { texto: '', es_correcta: false }, { texto: '', es_correcta: false }, { texto: '', es_correcta: false }]
    }));
};

const form = useForm({
    titulo: props.curso.titulo,
    descripcion: props.curso.descripcion,
    exigencia_minima: props.curso.exigencia_minima,
    max_intentos: props.curso.max_intentos,
    estado: props.curso.estado,
    imagen_portada: null,
    archivo_certificado: null, 
    
    modulos: props.curso.modulos && props.curso.modulos.length > 0 
        ? props.curso.modulos.map(m => ({ 
            id: m.id, 
            titulo: m.titulo, 
            contenido: m.descripcion_contenido || '', 
            duracion: m.duracion || '',
            link_video: m.link_video || '', 
            archivos_existentes: m.archivos || [], 
            archivos_nuevos: null 
        }))
        : [{ titulo: '', contenido: '', duracion: '', link_video: '', archivos_existentes: [], archivos_nuevos: null }],
        
    preguntas: formatearPreguntas()
});

const manejarSubidaImagen = (e) => form.imagen_portada = e.target.files[0];
const manejarSubidaCertificado = (e) => form.archivo_certificado = e.target.files[0]; 
const manejarArchivosModulo = (event, index) => {
    form.modulos[index].archivos_nuevos = Array.from(event.target.files);
};

const agregarModulo = () => form.modulos.push({ titulo: '', contenido: '', duracion: '', link_video: '', archivos_existentes: [], archivos_nuevos: null });
const eliminarModulo = (index) => form.modulos.splice(index, 1);

const agregarPregunta = () => form.preguntas.push({ tipo: 'multiple', texto: '', opciones: [{ texto: '', es_correcta: true }, { texto: '', es_correcta: false }, { texto: '', es_correcta: false }, { texto: '', es_correcta: false }], respuesta_vf: true });
const eliminarPregunta = (index) => form.preguntas.splice(index, 1);
const marcarCorrectaMultiple = (pIndex, oIndex) => form.preguntas[pIndex].opciones.forEach((o, i) => o.es_correcta = (i === oIndex));

const guardarCurso = (estado) => {
    form.estado = estado;
    form.post(route('profesor.cursos.update', props.curso.id), {
        preserveScroll: true,
        forceFormData: true,
        onSuccess: () => alert('Curso actualizado con éxito'),
        onError: (errors) => {
            console.error("ERRORES DEL FORMULARIO:", errors);
            alert("Hubo un error de validación o servidor. Abre la consola (F12) para ver qué dice el error en rojo.");
        }
    });
};

const borrarArchivoGuardado = (archivoId, moduloIndex, fileIndex) => {
    if (confirm('¿Estás seguro de que deseas eliminar este archivo de forma permanente?')) {
        router.delete(route('profesor.archivos.destroy', archivoId), {
            preserveScroll: true,
            onSuccess: () => {
                form.modulos[moduloIndex].archivos_existentes.splice(fileIndex, 1);
            }
        });
    }
};

const eliminarCurso = () => {
    if (confirm('⚠️ ¿Estás completamente seguro de que deseas eliminar este curso?\nSe borrarán todos sus módulos y examen.')) {
        router.delete(route('profesor.cursos.destroy', props.curso.id), {
            onSuccess: () => alert('Curso eliminado exitosamente.'),
        });
    }
};
</script>