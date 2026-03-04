# Backend Specification

## Objective
Provide reliable character response generation with persistent memory and safety enforcement.

## Service Modules
- `character-profile-service`: role definitions and versioned persona prompts
- `memory-service`: store and retrieve conversation memory by user-character key
- `relationship-service`: track trust/familiarity state transitions
- `response-service`: compose model input and generate reply
- `safety-service`: policy checks and fallback response generation

## Response Pipeline
1. Validate request and identity context
2. Load character profile
3. Retrieve scoped memory and relationship state
4. Build prompt with persona + context + memory
5. Generate candidate response
6. Apply safety checks
7. Persist turn and return response

## Reliability Rules
- Never return raw model errors directly to users
- Timeouts return controlled fallback message
- Store request IDs for observability and debugging
