import { RequestHandler } from "express";

import { File } from "../database/models/files";

import { Controller } from "./Controller";

import { FilesService } from "../services/filesService";

import {
	getByFolderIdSchema,
	newFileSchema,
	presignedPostSchema,
	updateFileEditorsSchema,
	updateFileSchema,
} from "../dto/files";

import { AuthMiddlewares } from "../middlewares/authMiddlewares";

import { InvalidParameterError } from "../errors/customErrors";

import { BaseResponse, okResponse } from "../api/baseResponses";

import { IS3PresignedPostResponse } from "../interfaces/files";

export class FilesController extends Controller {
	authMiddlewares: AuthMiddlewares;
	filesService: FilesService;

	constructor(filesService: FilesService, authMiddlewares: AuthMiddlewares) {
		super("/files");

		this.filesService = filesService;
		this.authMiddlewares = authMiddlewares;

		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			"/presigned-link",
			this.authMiddlewares.isAuthorized,
			this.link({ route: this.createPresignedPost })
		);
		this.router.post("/new", this.authMiddlewares.isAuthorized, this.link({ route: this.createFile }));
		this.router.post(
			"/list-by-folder/:id",
			this.authMiddlewares.isAuthorized,
			this.link({ route: this.getFilesByFolderId })
		);
		this.router.get("/:key", this.authMiddlewares.isAuthorized, this.link({ route: this.getObject }));
		this.router.put("/update/:id", this.authMiddlewares.isAuthorized, this.link({ route: this.updateFile }));
		this.router.put(
			"/update-editors/:id",
			this.authMiddlewares.isAuthorized,
			this.link({ route: this.updateEditors })
		);
	}

	private createPresignedPost: RequestHandler<{}, BaseResponse<IS3PresignedPostResponse>> = async (
		req,
		res,
		next
	) => {
		try {
			const validatedBody = presignedPostSchema.safeParse(req.body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			const key = validatedBody.data.key;
			const type = validatedBody.data.type;
			const presignedPost = await this.filesService.createPresignedPost(key, type);

			return res.status(200).json(okResponse(presignedPost));
		} catch (e) {
			next(e);
		}
	};

	private createFile: RequestHandler<{}, BaseResponse<File>> = async (req, res, next) => {
		try {
			const validatedBody = newFileSchema.safeParse(req.body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			//  @ts-ignore
			const user = req.user as IUser;

			const result = await this.filesService.create(validatedBody.data, user.id);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};

	private getFilesByFolderId: RequestHandler<{ id: number }, BaseResponse<File[]>> = async (
		req,
		res,
		next
	) => {
		try {
			const body = { folderId: req.params.id, name: req.body.name };
			const validatedBody = getByFolderIdSchema.safeParse(body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			//  @ts-ignore
			const user = req.user as IUser;
			const { folderId, name } = validatedBody.data;

			const result = await this.filesService.getListByFolderId(user.id, folderId, name);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};

	private getObject: RequestHandler<{ key: string }, BaseResponse<string>> = (req, res, next) => {
		try {
			const presignedPost = this.filesService.getObject(req.params.key);

			return res.status(200).json(okResponse(presignedPost));
		} catch (e) {
			next(e);
		}
	};

	private updateFile: RequestHandler<{ id: number }, BaseResponse<File>> = async (req, res, next) => {
		try {
			const body = { ...req.body, id: req.params.id };
			const validatedBody = updateFileSchema.safeParse(body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			const result = await this.filesService.update(validatedBody.data);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};

	private updateEditors: RequestHandler<{ id: number }, BaseResponse<File>> = async (req, res, next) => {
		try {
			const body = { ...req.body, id: req.params.id };
			const validatedBody = updateFileEditorsSchema.safeParse(body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			const { id, editorsIds } = validatedBody.data;

			const result = await this.filesService.updateEditors(id, editorsIds);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};
}
