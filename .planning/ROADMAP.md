# Roadmap

## Overview

| # | Phase | Goal | Requirements | Plans | Status |
|---|-------|------|--------------|-------|--------|
| 1 | Crowd Interaction Prototype | Deliver a mobile crowd scene where users can tap moving characters and enter chat mode | SCENE-01, SCENE-02, SCENE-03, CHAT-01, CHAT-02, CHAT-03, MEM-04 | 1/2 | ◐ In progress |
| 2 | Character Memory Foundation | Build role profiles and persistent per user-character memory | CHAR-01, MEM-01, MEM-02 | 0/3 | ○ Not started |
| 3 | Realistic Social Behavior Engine | Enforce stable persona and socially realistic relationship dynamics | CHAR-02, CHAR-03, MEM-03 | 0/3 | ○ Not started |
| 4 | Safety and Reliability Layer | Add guardrails, isolation, and graceful degradation | SAFE-01, SAFE-02, SAFE-03 | 0/3 | ○ Not started |
| 5 | Growth and Content Operations | Prepare repeatable content and data instrumentation for retention | v2 bridge items | 0/2 | ○ Not started |

## Phase Details

### Phase 1: Crowd Interaction Prototype

**Goal:** Users can discover moving characters in a mobile crowd and enter/exit a chat loop by tapping a character.

**Requirements:**
- SCENE-01: Mobile crowd with two-way movement
- SCENE-02: Speed variance and stable movement rendering
- SCENE-03: Tap reliability on moving targets
- CHAT-01: Tap a moving character to select
- CHAT-02: Character approaches and enters chat state
- CHAT-03: Exit chat and return to crowd
- MEM-04: Local memory retrieval before response generation

**Success Criteria:**
1. On mainstream mobile devices, users can continuously observe multi-character movement without severe frame drops.
2. Users can tap a moving character and consistently trigger the approach-to-chat transition.
3. Users can end chat and return to the crowd state without losing scene continuity.
4. Each chat turn performs local-memory retrieval before generating character reply.

**Dependencies:** None (first phase)

---

### Phase 2: Character Memory Foundation

**Goal:** Users can experience distinct characters that remember prior interactions across sessions.

**Requirements:**
- CHAR-01: Distinct role identity and speaking style
- MEM-01: Persistent user-character memory
- MEM-02: Continuity recall from prior conversations

**Success Criteria:**
1. Each role demonstrates clearly different voice and perspective in similar prompts.
2. After returning later, users see correct recall of relevant prior details with the same character.
3. Memory retrieval is scoped by user-character key and does not cross-contaminate.

**Dependencies:** Phase 1

---

### Phase 3: Realistic Social Behavior Engine

**Goal:** Users experience believable social distance, relationship progression, and stable persona behavior.

**Requirements:**
- CHAR-02: Persona consistency across sessions
- CHAR-03: Plausible first-contact behavior
- MEM-03: Relationship state progression

**Success Criteria:**
1. Stranger characters do not immediately respond with over-familiar tone.
2. Repeated interactions produce measurable relationship progression and adjusted response style.
3. Persona style remains stable in tone and boundaries over long conversations.

**Dependencies:** Phase 2

---

### Phase 4: Safety and Reliability Layer

**Goal:** Users receive trustworthy, policy-bounded responses with robust fallback under failure.

**Requirements:**
- SAFE-01: Sensitive-topic guardrails
- SAFE-02: Memory isolation guarantees
- SAFE-03: Graceful failure fallback

**Success Criteria:**
1. Sensitive prompts trigger safe and bounded responses.
2. Isolation tests confirm no memory leakage across users or characters.
3. Model/network failures produce user-friendly fallback rather than broken flows.

**Dependencies:** Phase 2, Phase 3

---

### Phase 5: Growth and Content Operations

**Goal:** Team can expand characters and operate retention loops with measurable outcomes.

**Requirements:**
- AUDIO-01 (bridge planning only)
- ANIM-01 (bridge planning only)
- SOCIAL-01 (bridge planning only)

**Success Criteria:**
1. Content team has a repeatable process for adding new characters and story arcs.
2. Product has baseline analytics for character click-through, conversation completion, and retention.

**Dependencies:** Phase 1, Phase 2, Phase 3, Phase 4

## Coverage Validation

All v1 requirements mapped: ✓  
Unmapped requirements: None
