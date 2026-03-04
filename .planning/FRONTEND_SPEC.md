# Frontend Specification

## Objective
Deliver a smooth mobile H5 experience for crowd discovery and character chat.

## Architecture
- `scene/`: crowd rendering and movement logic
- `interaction/`: tap hit-testing and state transitions
- `chat/`: message panel and conversation lifecycle
- `shared/`: config, constants, utilities

## UI States
1. `crowd_idle`: user exploring moving characters
2. `character_selected`: character is highlighted and approaching
3. `chat_active`: character conversation panel active
4. `chat_closing`: transition back to crowd

## Performance Requirements
- Target frame rate: 30-60 FPS on mid-range mobile devices
- Input responsiveness: tap feedback under 100 ms
- Scene load: first interactive paint under 3 seconds (good network)

## Interaction Standards
- Touch-first controls, no hover dependency
- Character tap zones calibrated for moving targets
- Clear visual indication for selected character

## Accessibility and UX
- Text must remain readable on small screens
- Safe-area handling for devices with notches
- Contrast-compliant chat text and controls
