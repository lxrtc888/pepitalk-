# Research Summary

## Key Findings

- The product’s first retention loop is not “chat quality alone,” but “discover -> tap -> approach -> remembered follow-up.”
- For crowd rendering on mobile, PixiJS patterns (ticker deltas, FPS cap, culling) reduce frame instability and battery pressure.
- For memory persistence, Supabase/Postgres should use explicit per user-character scoping, indexed retrieval, and RLS isolation.

## Recommended v1 Focus

1. Make crowd interaction loop feel smooth and clickable.
2. Deliver believable continuity with minimal but high-quality memory retrieval.
3. Enforce stable social personality and safety boundaries.

## Context7 References Used

- PixiJS documentation and code examples (Ticker, culling, maxFPS, cache-as-texture patterns).
- Supabase documentation and examples (RLS policy patterns, chat persistence model, indexing strategy).
