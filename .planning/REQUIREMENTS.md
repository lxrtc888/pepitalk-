# Requirements

## v1 Requirements

### Scene and Navigation

- [ ] **SCENE-01**: User can open the H5 on mobile and see a crowd scene with characters moving both left-to-right and right-to-left.
- [ ] **SCENE-02**: User can observe different character speeds and direction changes without visual overlap glitches.
- [ ] **SCENE-03**: User can keep stable interaction during movement (no tap loss when characters are moving).

### Tap-to-Chat Interaction

- [ ] **CHAT-01**: User can tap a moving character to select it.
- [ ] **CHAT-02**: User can see the selected character approach and enter a dedicated chat state.
- [ ] **CHAT-03**: User can return from chat state back to crowd exploration.

### Character Persona and Consistency

- [ ] **CHAR-01**: User can experience distinct character identity (name, background, personality, speaking style).
- [ ] **CHAR-02**: User can observe stable persona behavior across sessions for the same character.
- [ ] **CHAR-03**: User can receive socially plausible first-contact behavior from unfamiliar characters.

### Memory and Relationship

- [ ] **MEM-01**: User can be remembered by the same character across sessions.
- [ ] **MEM-02**: User can have ongoing conversation continuity where character references relevant prior topics.
- [ ] **MEM-03**: User can build relationship state per character (for example: unfamiliar, familiar, trusted).
- [ ] **MEM-04**: User can have local-device memory retrieval before each new response turn.

### Safety and Experience Quality

- [ ] **SAFE-01**: User can receive safe, bounded responses for sensitive or harmful prompts.
- [ ] **SAFE-02**: User can avoid memory leakage between different characters and accounts.
- [ ] **SAFE-03**: User can get graceful fallback responses when model or network fails.

## v2 Requirements (Deferred)

- [ ] **AUDIO-01**: User can hear character voice replies with expressive tone — deferred because text realism must be validated first.
- [ ] **ANIM-01**: User can see advanced character body language and emotional micro-animations — deferred because baseline motion and dialogue must stabilize first.
- [ ] **SOCIAL-01**: User can observe interactions between characters in-world — deferred because user-to-character loop is the first retention driver.

## Out of Scope

- Full open-world map and free camera controls — excluded to keep mobile performance predictable.
- User-generated character creation in v1 — excluded to prevent inconsistent quality during initial validation.
- Real-time user-to-user chat ecosystem — excluded to focus on AI character realism first.

## Traceability

| REQ-ID | Requirement | Phase | Status |
|--------|-------------|-------|--------|
| SCENE-01 | Mobile crowd with two-way movement | Phase 1 | [ ] Pending |
| SCENE-02 | Speed variance and stable movement rendering | Phase 1 | [ ] Pending |
| SCENE-03 | Tap reliability on moving targets | Phase 1 | [ ] Pending |
| CHAT-01 | Tap a moving character to select | Phase 1 | [ ] Pending |
| CHAT-02 | Character approaches and enters chat state | Phase 1 | [ ] Pending |
| CHAT-03 | Exit chat and return to crowd | Phase 1 | [ ] Pending |
| CHAR-01 | Distinct role identity and speaking style | Phase 2 | [ ] Pending |
| CHAR-02 | Persona consistency across sessions | Phase 3 | [ ] Pending |
| CHAR-03 | Plausible first-contact behavior | Phase 3 | [ ] Pending |
| MEM-01 | Persistent user-character memory | Phase 2 | [ ] Pending |
| MEM-02 | Continuity recall from prior conversations | Phase 2 | [ ] Pending |
| MEM-03 | Relationship state progression | Phase 3 | [ ] Pending |
| MEM-04 | Local memory retrieval before response generation | Phase 1 | [ ] Pending |
| SAFE-01 | Sensitive-topic guardrails | Phase 4 | [ ] Pending |
| SAFE-02 | Memory isolation guarantees | Phase 4 | [ ] Pending |
| SAFE-03 | Graceful failure fallback | Phase 4 | [ ] Pending |

## Acceptance Checks (v1)

| REQ-ID | Acceptance check |
|--------|------------------|
| SCENE-01 | On mobile viewport load, at least 20 characters are visible and moving in both directions within 3 seconds. |
| SCENE-02 | During 60-second observation, no severe overlap artifact blocks character identity recognition. |
| SCENE-03 | In 30 tap attempts on moving characters, at least 27 trigger valid selection. |
| CHAT-01 | Tapping any visible character highlights the same character ID in interaction state. |
| CHAT-02 | Selected character transitions to chat state within 1.2 seconds with visible approach behavior. |
| CHAT-03 | User can close chat and restore crowd state with movement continuity in under 500 ms. |
| CHAR-01 | Prompting 3 characters with same input yields clearly distinct tone and perspective. |
| CHAR-02 | Same character retains style consistency over 3 separate sessions. |
| CHAR-03 | New-user first contact follows stranger-safe greeting pattern. |
| MEM-01 | Returning user gets at least 1 accurate memory reference from prior session with same character. |
| MEM-02 | Character can continue one unfinished topic from the immediately prior conversation. |
| MEM-03 | Relationship state changes only after defined interaction thresholds. |
| MEM-04 | For every chat turn, app executes memory retrieval from local storage before generating reply. |
| SAFE-01 | Sensitive prompts trigger policy-aligned refusal or de-escalation response. |
| SAFE-02 | Cross-user and cross-character memory leakage tests return zero unauthorized recalls. |
| SAFE-03 | On model/API failure, user sees fallback reply and retry option instead of hard error. |
