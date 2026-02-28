import type { z } from "zod";
import type { UserModelSchema } from "generated/zod/schemas/variants/pure/User.pure";

// ── Inferred types ────────────────────────────────────────

export type User = z.infer<typeof UserModelSchema>;
