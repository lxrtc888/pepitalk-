# Stack Research

## Candidate Stack (Mobile H5 + AI Character Memory)

### Frontend
- Runtime: Vite + TypeScript
- Rendering option A (recommended for crowded motion): PixiJS v8
- Rendering option B (simpler but lower ceiling): Canvas 2D API
- UI overlay: React (or Vanilla UI layer) for chat panel and controls

### Backend
- API: Node.js + Fastify (or Express if team familiarity is higher)
- AI orchestration: provider SDK + server-side prompt templates
- Memory service: PostgreSQL + retrieval layer

### Data and Infra
- Database: Supabase Postgres
- Auth: Supabase Auth (anonymous-to-registered upgrade path)
- Realtime (optional later): Supabase Realtime

## Why These Choices

- PixiJS offers strong performance for many moving sprites and mobile rendering optimization.
- Supabase gives practical Postgres + auth + RLS for per-user memory isolation.
- Fastify/Express keeps backend iteration speed high for persona and memory logic changes.

## Context7 Best-Practice Notes

### PixiJS
- Use `Ticker` delta time updates for frame-rate-independent movement.
- Cap frame rate on mobile (`maxFPS`) to reduce battery and thermal pressure.
- Enable culling to avoid rendering off-screen objects.
- Consider container-level cache as texture for static-heavy groups.

### Supabase / Postgres
- Treat realtime transport and persistence separately; broadcast is not persistence.
- Add focused indexes on participant and timestamp fields for chat retrieval.
- Enforce row-level security policies tied to authenticated user identity.

## Avoid

- Monolithic scene logic mixed with chat logic (hard to scale and debug).
- Storing memory as a single unstructured blob without retrieval metadata.
- Overbuilding voice/avatar systems before validating text interaction retention.
