# TripShare — Hackathon Reflection

## What Worked Well

### CLAUDE.md from day one
Having a tight CLAUDE.md in place before writing any feature code was the single highest-leverage decision. Every session that opened with the file in context required zero re-explanation of the stack, conventions, or security rules. Sessions without it produced code that mixed `.then()` chains with `async/await`, skipped Zod validation, or used `any` throughout. The file paid for itself within the second session.

### Spec-first feature prompts
The best prompts were the ones that specified every decision before implementation started — status state machines for bookings, room naming for chat, token rotation for auth. Prompts that said "implement X" without constraints produced code that was technically correct but architecturally wrong (missing status transitions, wrong error codes, no auth guard). The discipline of writing a mini-spec inside each prompt correlated directly with prompt quality.

### Separating concerns in the prompt
Breaking large features into "backend first, then frontend" and keeping each session focused on one domain (trips, bookings, chat) produced clean, modular code. Sessions that tried to span multiple domains in one prompt produced correct code with tangled imports and inconsistent naming.

### Using MCPs for real work
The Atlassian MCP was used to create 136 Jira tickets (18 epics, 118 stories) in a single session — something that would have taken days manually. Treating MCPs as first-class tools rather than novelties turned Jira into a real project tracking system instead of an afterthought.

### Custom skills for repeated patterns
The `.claude/skills/` skills (`add-api-route`, `write-backend-test`, `add-component`, `add-api-call`) eliminated the need to re-specify the same conventions in every prompt. After the skills were in place, adding a new route went from a 200-word prompt to a 30-word one.

---

## What Didn't Work

### Firebase OTP auth
The Firebase phone OTP implementation was technically correct but required 4 external configurations (Phone provider, reCAPTCHA, App Check, domain whitelist) that couldn't be done quickly during the hackathon. Two hours were lost before switching to email + password. The lesson: validate third-party dependency configuration requirements before writing code.

### Vague prompts early in development
The first booking feature prompt was "implement the bookings feature". The output was a two-field schema with no status machine, no seat tracking, no double-booking guard, and no notification triggers. It required a full rewrite. Early-stage prompts need to be the most detailed because architectural decisions made then are the hardest to change later.

### Long single-session context
Sessions that grew past ~200k tokens started producing code that forgot earlier decisions — reintroducing `console.log` statements, missing auth guards on some endpoints, or using wrong field names. Breaking large features into multiple focused sessions would have produced cleaner output. The context window is not infinite working memory.

### Not setting up monitoring earlier
PostHog and Sentry were planned but not implemented before the submission deadline. Having real user analytics and error tracking would have surfaced bugs found during testing much faster. For future projects: wire in observability in the scaffolding session, not as an afterthought.

---

## What I'd Do Differently

1. **Write the prompt log as I go** — reconstructing 15 sessions of prompts from memory at the end is error-prone. A `prompt-log.md` stub from day one with one entry added per major session would be more accurate and require no end-of-hackathon scramble.

2. **Constraint prompt for any third-party integration** — before implementing any integration (Firebase, Stripe, Twilio, etc.), ask Claude: "What needs to be configured in the external dashboard? What environment variables are required? What are the common failure modes?" This surfaces blockers before implementation starts.

3. **One skill per repeated pattern, earlier** — I added skills on the last day. Adding them after the first repetition (second route, second component) would have saved prompt tokens across every subsequent session.

4. **Incremental commits** — most commits were large ("implement entire bookings feature"). Smaller commits per endpoint would have made rollbacks easier when the Firebase OTP switch happened.

5. **Seed data in the scaffolding session** — testing the UI against real-ish data would have caught edge cases (long route names, max seats, zero ratings) much earlier. A `scripts/seed.ts` file should be created in session one.

---

## Claude Code Observations

- Claude Code's git integration (reading diffs, checking git log) significantly reduces "what's the current state" prompts — it finds its own context rather than requiring the developer to re-explain.
- The Skill system allows expert-level convention enforcement without adding to CLAUDE.md length. CLAUDE.md should stay strategic (stack, security, conventions); skills should stay tactical (step-by-step patterns).
- Claude Sonnet 4.6 handled TypeScript strict mode well — it rarely needed prompting to avoid `any` once the rule was in CLAUDE.md.
- The biggest quality gap was between sessions with a clear mini-spec in the prompt and sessions with only a feature name. The spec sessions produced merge-ready code; the name-only sessions produced first-draft code that needed revision.
