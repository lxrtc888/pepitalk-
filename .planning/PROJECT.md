# CrowdLife H5

## What This Is

CrowdLife H5 is a mobile-first social simulation website where many characters move across a crowd scene and users can tap any character to start a realistic conversation.  
Each character has a persistent identity and relationship arc, so interactions feel like meeting real people over time instead of chatting with a generic bot.

## Core Value

Users can repeatedly meet the same character and feel continuity, because the character remembers past interactions and responds with stable personality.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Mobile crowd scene with bi-directional character movement.
- [ ] Tap-to-approach interaction that transitions from crowd state to chat state.
- [ ] Character persona system (background, traits, speaking style, social boundaries).
- [ ] Per user-character persistent memory across sessions.
- [ ] Local-device memory persistence and retrieval before each conversation reply.
- [ ] Realistic social response logic (distance, context, emotional state).
- [ ] Safety policy and refusal/de-escalation behaviors for sensitive prompts.

### Out of Scope

- Full 3D world and physics-driven free roam in v1 — high complexity and low initial validation value.
- Open multiplayer user-to-user social graph in v1 — focus first on user-to-character realism.
- Voice calling and avatar lip-sync in v1 — text-first interaction validates retention faster.

## Context

- Product type: mobile H5 interactive narrative + AI social simulation.
- Primary UX hook: users discover moving characters, then build ongoing relationships.
- Desired quality bar: realistic social pacing, non-repetitive greetings, memory continuity.
- Key risk: persona drift and low-quality memory retrieval can break immersion.
- Inspiration: animated crowd scene with many characters walking in both directions.

## Constraints

- **Platform**: Mobile-first H5 — must run smoothly on mid-range devices.
- **Performance**: Stable frame pacing in crowded scene — avoid overheating and battery drain.
- **Continuity**: Memory must persist per user-character pair — cannot leak across characters.
- **Storage strategy**: v1 memory lives on user local device first — minimize backend complexity in early validation.
- **Safety**: Sensitive topics require policy-constrained responses and escalation boundaries.
- **Execution**: Phase-based GSD workflow — avoid monolithic one-shot implementation.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Full vision with phased delivery | Protect long-term ambition while reducing execution risk | ✓ Good |
| Mobile-first interaction model | Core usage is tap-based, short-session, phone-centric | ✓ Good |
| Text-first social realism before voice | Faster iteration on personality and memory quality | ✓ Good |
| Per user-character memory key | Prevent context pollution and improve narrative continuity | ✓ Good |
| Local-first memory for v1 | Faster MVP iteration with lower infrastructure cost | ✓ Good |
| Safety guardrail as first-class service | Realistic social app requires trust and protection | ✓ Good |

---
*Last updated: 2026-03-03 after GSD new-project initialization*
