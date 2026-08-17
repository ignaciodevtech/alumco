# Product

## Register

product

## Users

Colaboradores de ONG Alumco (estudiantes/trabajadores) que toman cursos de capacitación obligatorios u opcionales desde el navegador, muchas veces con distinta alfabetización digital — de ahí la barra de accesibilidad (alto contraste, tamaño de texto) ya presente en el header. También hay profesores (crean cursos, revisan estudiantes) y administradores (gestionan la plataforma, usuarios, reportes). El registro primario de la plataforma es **producto** (dashboard, cursos, exámenes, perfil, ranking, paneles admin/profesor), pero `Home.tsx` es la landing pública de cara a visitantes no autenticados y funciona con lógica de marca/marketing.

## Product Purpose

CapacitaciónPro es una plataforma de capacitación y certificación profesional para ONG Alumco: cursos por módulos, exámenes con intentos limitados, certificados verificables y un sistema de gamificación (puntos, niveles, insignias, rachas diarias, ranking por sede) que busca aumentar la motivación y finalización de cursos. Éxito = colaboradores que vuelven todos los días, completan más cursos y compiten sanamente por puntos/insignias.

## Brand Personality

Épica y competitiva, no infantil. La meta es que aprender se sienta como jugar: subir de nivel, desbloquear insignias, mantener una racha, escalar en el ranking — pero manteniendo la seriedad de una plataforma de capacitación corporativa/ONG real. Energía de "logro" y "rango" (más cercano a un pase de temporada / sistema de rangos de esports) que a un juego casual para niños.

## Anti-references

- Nada infantil: sin mascotas de caricatura, sin paleta pastel "kawaii", sin tono para niños.
- Nada de estética casino/apuestas: sin ruletas, slot machines, iconografía de apuestas, aunque se gamifique.
- Evitar el look SaaS gris/azul genérico por defecto (gradiente azul de shadcn sin personalidad) — ese es exactamente el problema a resolver.
- Evitar que el "look gamer" comprometa la seriedad institucional de una ONG frente a auditores, profesores o administradores.

## Design Principles

1. **Aprender se siente como jugar, sin dejar de ser una plataforma seria de capacitación real.** El tono es épico/competitivo (rangos, progreso, logros), no casual-infantil.
2. **La gamificación es la capa vívida sobre una base sobria.** La UI general (formularios, tablas, navegación) se mantiene clara y funcional; los puntos de gamificación (nivel, XP, insignias, racha, ranking) y la landing concentran el color saturado, el glow y el movimiento.
3. **Todo lo que se mueve o brilla respeta accesibilidad primero.** Alto contraste y tamaño de texto (ya existentes) siguen funcionando sobre cualquier efecto nuevo; toda animación tiene alternativa `prefers-reduced-motion`.
4. **El impacto visual está en el detalle, no en el ruido.** Micro-interacciones y celebraciones (subir de nivel, ganar insignia, racha) deben sentirse como recompensa, no como spam.
5. **Consistencia entre roles.** Estudiante, profesor y administrador ven el mismo lenguaje visual de gamificación (colores, tipografía de rango, motion), pero la intensidad se adapta al contexto de cada panel.

## Accessibility & Inclusion

- Preservar y no romper las funciones de accesibilidad existentes: alto contraste (`html.high-contrast`) y tamaño de texto (`fs-large`/`fs-xlarge`).
- Contraste de texto ≥4.5:1 (cuerpo) / ≥3:1 (texto grande) incluso sobre fondos oscuros/neón nuevos.
- Toda animación nueva debe tener alternativa con `prefers-reduced-motion: reduce`.
- Público con distintos niveles de alfabetización digital: evitar depender solo del color para comunicar estado (usar iconos/texto además de color).
