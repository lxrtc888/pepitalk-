# Pitfalls Research

## Common Mistakes

- Mixing rendering, interaction, and chat logic in one module
- Letting persona prompts drift after multiple iterations
- Saving all chats but retrieving irrelevant memory chunks
- Ignoring mobile thermal and battery constraints in crowded scenes
- Treating realtime delivery as durable storage

## Prevention Strategies

- Keep strict module boundaries and event contracts
- Version character persona profiles and pin core style tokens
- Store structured memory with tags (topic, emotional tone, recency, confidence)
- Cap FPS and enable culling for off-screen entities
- Persist each turn explicitly in Postgres with indexes and RLS

## Early Warning Signs

- Users report characters “suddenly changed personality”
- Recall quality feels random or references wrong facts
- Tap interactions fail frequently during movement
- Frame pacing drops sharply when crowd size increases
