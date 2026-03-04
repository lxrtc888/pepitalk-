# Database Design

## Primary Entities

### users
- `id` (uuid, pk)
- `created_at` (timestamp)

### characters
- `id` (uuid, pk)
- `name` (text)
- `persona_version` (text)
- `profile_json` (jsonb)
- `created_at` (timestamp)

### user_character_state
- `id` (uuid, pk)
- `user_id` (uuid, fk users.id)
- `character_id` (uuid, fk characters.id)
- `relationship_level` (text)
- `last_seen_at` (timestamp)
- `summary_memory` (text)
- unique(`user_id`, `character_id`)

### conversation_turns
- `id` (uuid, pk)
- `user_id` (uuid, fk users.id)
- `character_id` (uuid, fk characters.id)
- `role` (text: user|assistant|system)
- `content` (text)
- `topic_tags` (text[])
- `created_at` (timestamp)

## Indexing Strategy
- `conversation_turns(user_id, character_id, created_at desc)`
- `user_character_state(user_id, character_id)` unique index
- Optional topic index for retrieval filtering

## Security
- Apply row-level security by `auth.uid() = user_id`
- Enforce user-character scoped retrieval only
- No cross-user memory reads allowed
