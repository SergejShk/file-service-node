import { z } from "zod";

export const presignedPostSchema = z
	.object({
		key: z.string(),
		type: z.string(),
	})
	.strict();
