import { RequestHandler } from "express";

import { Controller } from "./Controller";

import { FilesService } from "../services/filesService";

import { presignedPostSchema } from "../dto/files";

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
}