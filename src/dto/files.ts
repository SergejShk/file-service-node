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

export const getByFolderIdSchema = z
	.object({
		folderId: z.coerce.number(),
		name: z.string(),
	})
	.strict();

export const updateFileSchema = z
	.object({
		id: z.coerce.number(),
		name: z.string(),
		isPublick: z.boolean(),
	})
	.strict();

export const updateFileEditorsSchema = z
	.object({
		id: z.coerce.number(),
		editorsIds: z.number().array(),
	})
	.strict();

export const deleteFileSchema = z
	.object({
		id: z.coerce.number(),
		key: z.string(),
	})
	.strict();
