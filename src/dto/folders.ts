import { z } from "zod";

export const newFolderSchema = z
	.object({
		name: z.string(),
		isPublick: z.boolean(),
		editorsIds: z.string().array(),
		parentId: z.number(),
	})
	.strict();
