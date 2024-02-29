import { z } from "zod";

export const newFolderSchema = z
	.object({
		name: z.string(),
		isPublick: z.boolean(),
		editorsIds: z.string().array().optional(),
		parentId: z.number().optional(),
	})
	.strict();

export const getByParentIdSchema = z.coerce.number();

export const updateFolderSchema = z
	.object({
		id: z.coerce.number(),
		name: z.string(),
		isPublick: z.boolean(),
	})
	.strict();
