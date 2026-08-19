<template>
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
        <nav class="flex justify-between items-center px-8 py-4 bg-white border-b border-slate-200 shadow-sm">
            
            <div class="flex items-center gap-8">
                <Link href="/dashboard" class="flex items-center gap-3 no-underline transition-transform hover:scale-105">
                    <img src="/images/logo-alumco.png" alt="Logo ONG Alumco" class="h-[120px] w-auto object-contain" />
                    <span class="font-bold text-blue-800 text-xl tracking-tight hidden sm:block"></span>
                </Link>
                
                <div class="hidden md:flex items-center gap-6 text-sm font-medium">

                    <template v-if="$page.props.auth.user.rol === 'admin'">
                        <Link :href="route('admin.cursos.index')" :class="route().current('admin.cursos.*') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                            Todos los Cursos
                        </Link>

                        <Link :href="route('admin.cursos.create')" :class="route().current('admin.cursos.create') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                            Crear Curso
                        </Link>

                        <Link :href="route('admin.alumnos.index')" :class="route().current('admin.alumnos.*') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                             Alumnos
                        </Link>

                        <Link :href="route('admin.profesores.index')" :class="route().current('admin.profesores.*') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                            Profesores
                        </Link>

                        <!-- NUEVO ENLACE DE ESTADÍSTICAS (Adaptado al diseño) -->
                        <Link :href="route('admin.estadisticas')" :class="route().current('admin.estadisticas') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                            Estadísticas
                        </Link>

                    </template>

                    <template v-else-if="$page.props.auth.user.rol === 'profesor'">
                        <Link :href="route('profesor.cursos.index')" :class="route().current('profesor.cursos.*') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                            Mis Cursos
                        </Link>
                        
                    </template>

                    <template v-else-if="$page.props.auth.user.rol === 'alumno'">
                        <Link :href="route('alumno.explorar')" :class="route().current('alumno.explorar') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                            Explorar Cursos
                        </Link>
                        
                        <Link :href="route('alumno.dashboard')" :class="route().current('alumno.dashboard') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                            Mis Cursos
                        </Link>

                        <Link :href="route('mis-logros')" :class="route().current('mis-logros') ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900 transition'">
                            Mis Logros
                        </Link>
                    </template>
                    
                </div>
            </div>

            <div class="flex items-center gap-4">
                
                <Link :href="$page.props.auth.user.rol === 'admin' ? route('admin.perfil') : route('profile.edit')" class="flex items-center gap-2 border border-slate-200 py-1.5 px-3 rounded-lg bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition no-underline text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-sm font-medium">{{ $page.props.auth.user.name }}</span>
                    <span class="ml-1 text-[10px] uppercase bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                        {{ $page.props.auth.user.rol }}
                    </span>
                </Link>

                <Link :href="route('logout')" method="post" as="button" class="text-sm text-red-500 font-medium hover:text-red-700 transition">
                    Cerrar Sesión
                </Link>
            </div>

        </nav>

        <main>
            <slot />
        </main>
    </div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
</script>