# Architecture Research

## Recommended Boundaries

1. `CrowdEngine` (movement, spawn, culling, hit testing)
2. `InteractionController` (tap select, approach animation, state transitions)
3. `ChatController` (conversation lifecycle and UI state)
4. `CharacterBrain` (prompt composition, persona enforcement, response generation)
5. `MemoryService` (store/retrieve short-term and long-term memory)
6. `SafetyGuard` (input/output policy checks and fallback handling)

## Data Flow

1. User taps character in crowd.
2. Interaction controller resolves character ID and transitions to chat state.
3. Chat controller requests memory context from memory service.
4. Character brain composes response with persona + memory + relationship state.
5. Safety guard validates response before delivery.
6. Conversation turn is persisted to memory store.

## Suggested Build Order

1. Crowd movement and tap reliability
2. Approach-to-chat transition and chat shell
3. Basic character profiles and deterministic style prompts
4. Persistent memory with per user-character key
5. Relationship state machine and social-distance logic
6. Safety guardrails and reliability fallback
