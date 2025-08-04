## Estrategia de Sincronización de Ramas Paralelas - AncloraPress UI

### Objetivo

Garantizar la coherencia, trazabilidad y compatibilidad entre las ramas paralelas de desarrollo:

- `feat/ChatGPT-fase1`
- `feat/Claude-fase1`
- `feat/Perplexity-fase1`

### 1. Convenciones de Ramas y Commits

- Prefijo obligatorio por agente: `chatgpt:`, `claude:`, `perplexity:`
- Commits deben seguir convención semántica: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`
- Commits múltiples por día permitidos solo si:
  - Aportan una mejora atómica
  - No generan ruptura

**Ejemplo de commit:**

```
chatgpt: feat: implementar editor visual básico en MVP
```

### 2. Ramas protegidas

- `main` y `dev` deben mantenerse estables.
- Pull Requests desde ramas de agente requieren:
  - Revisión cruzada por el usuario
  - Comparación funcional y visual con ramas paralelas antes de fusión

### 3. Criterios de Comparación entre Ramas

- Arquitectura del componente
- Calidad del código y modularidad
- Estilo visual y cumplimiento de guía de estilos
- Experiencia de usuario (flujo, claridad, accesibilidad)
- Rendimiento (si aplica)

### 4. Archivo de Estado Compartido

Ubicación sugerida: `/docs/estado-ramas.md`

Debe incluir:

- Fecha de última actualización
- Estado por rama: "En desarrollo", "Pendiente de merge", "Finalizada"
- Componentes implementados en cada rama
- Notas de divergencia o conflictos detectados

### 5. Frecuencia de Sincronización

- Sincronización base desde `main` cada lunes
- Revisión cruzada de ramas cada viernes
- Comparación de componentes una vez completada cada fase funcional

### 6. Conflictos y Resoluciones

- Priorizar integridad de interfaz final sobre preferencia de agente
- En caso de conflicto no resoluble, definir ronda de comparación por criterios técnicos/UX

### 7. Evaluación Final por el Usuario

- El usuario evaluará la versión final de cada fase y decidirá:
  - Cuál rama se fusiona a `main`
  - Cuáles implementaciones se conservarán como alternativas
  - Cuáles serán archivadas o descartadas

---

Este documento debe mantenerse actualizado conforme avance cada fase de desarrollo.