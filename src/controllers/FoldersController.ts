import { RequestHandler } from "express";

import { Controller } from "./Controller";

import { FoldersService } from "../services/foldersService";

import { BaseResponse, okResponse } from "../api/baseResponses";

import { AuthMiddlewares } from "../middlewares/authMiddlewares";

import { getByParentIdSchema, newFolderSchema } from "../dto/folders";

import { InvalidParameterError } from "../errors/customErrors";

import { IUser } from "../interfaces/auth";
import { IFolder } from "../interfaces/folders";

export class FoldersController extends Controller {
	foldersService: FoldersService;
	authMiddlewares: AuthMiddlewares;

	constructor(foldersService: FoldersService, authMiddlewares: AuthMiddlewares) {
		super("/folders");

		this.authMiddlewares = authMiddlewares;
		this.foldersService = foldersService;

		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post("/new", this.authMiddlewares.isAuthorized, this.link({ route: this.createFolder }));
		this.router.get(
			"/list-by-user",
			this.authMiddlewares.isAuthorized,
			this.link({ route: this.getFoldersByUserId })
		);
		this.router.get(
			"/list-by-parent/:id",
			this.authMiddlewares.isAuthorized,
			this.link({ route: this.getFoldersByParentId })
		);
	}

	private createFolder: RequestHandler<{}, BaseResponse<IFolder>> = async (req, res, next) => {
		try {
			const validatedBody = newFolderSchema.safeParse(req.body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			//  @ts-ignore
			const user = req.user as IUser;

			const result = await this.foldersService.create(validatedBody.data, user.id);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};

	private getFoldersByUserId: RequestHandler<{}, BaseResponse<IFolder[]>> = async (req, res, next) => {
		try {
			//  @ts-ignore
			const user = req.user as IUser;

			const result = await this.foldersService.getListByUserId(user.id);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};

	private getFoldersByParentId: RequestHandler<{ id: number }, BaseResponse<IFolder[]>> = async (
		req,
		res,
		next
	) => {
		try {
			const validatedBody = getByParentIdSchema.safeParse(Number(req.params.id));

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			//  @ts-ignore
			const user = req.user as IUser;

			const result = await this.foldersService.getListByParentId(user.id, validatedBody.data);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};
}
