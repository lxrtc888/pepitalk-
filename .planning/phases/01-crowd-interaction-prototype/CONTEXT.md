# Phase 1 Context: Crowd Interaction Prototype

## Phase Goal
Deliver a playable mobile H5 prototype where users can discover moving characters, tap one, and enter a conversation state.

## Included Requirements
- SCENE-01
- SCENE-02
- SCENE-03
- CHAT-01
- CHAT-02
- CHAT-03

## UX Narrative
1. User opens the page and sees a living crowd at the bottom area.
2. Characters move left/right with slight speed and behavior variance.
3. User taps one character.
4. Selected character approaches user interaction layer.
5. Chat panel opens with first line greeting.
6. User can close chat and return to crowd.

## Technical Notes
- Keep scene loop independent from chat UI state.
- Maintain character identity from crowd state into chat state.
- Favor deterministic transition timings for reliable UX testing.

## Risks
- Hit-testing moving sprites can feel inaccurate on mobile touch.
- Transition animation may break continuity if character state is not preserved.
- Overly dense crowd may reduce tap precision.
