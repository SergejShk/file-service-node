import { z } from "zod";

export const presignedPostSchema = z
	.object({
		key: z.string(),
		type: z.string(),
	})
	.strict();

export const newFileSchema = z
	.object({
		name: z.string(),
		key: z.string(),
		isPublick: z.boolean(),
		editorsIds: z.number().array().optional(),
		folderId: z.number().optional(),
	})
	.strict();
