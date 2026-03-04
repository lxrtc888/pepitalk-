# Phase 1 Execution Plan

## Plan 1: Scene Engine and Crowd Motion

### Scope
- Build mobile viewport scene container.
- Spawn crowd characters with two-way movement.
- Add speed variance and boundary turn/respawn behavior.

### Definition of Done
- At least 20 visible characters move smoothly.
- Scene remains interactive under normal mobile conditions.

## Plan 2: Tap Selection and Chat Transition

### Scope
- Implement touch hit-testing for moving characters.
- Add selected-state visual feedback.
- Animate selected character into chat approach state.
- Open/close chat panel with state restoration.

### Definition of Done
- Selection success rate >= 90% in manual test.
- Enter/exit chat does not break crowd loop state.

## Plan 3: Instrumentation and Validation

### Scope
- Add basic event logging: scene_enter, character_tap, chat_open, chat_close.
- Record transition timing and selection success metrics.

### Definition of Done
- Events are emitted consistently during test runs.
- Metrics data is sufficient for prototype quality review.
