import { RequestHandler } from "express";

import { Controller } from "./Controller";

import { FoldersService } from "../services/foldersService";

import { BaseResponse, okResponse } from "../api/baseResponses";

import { AuthMiddlewares } from "../middlewares/authMiddlewares";

import {
	getByParentIdSchema,
	newFolderSchema,
	updateFolderEditorsSchema,
	updateFolderSchema,
} from "../dto/folders";

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
		this.router.post(
			"/list-by-parent/:id",
			this.authMiddlewares.isAuthorized,
			this.link({ route: this.getFoldersByParentId })
		);
		this.router.put(
			"/update/:id",
			this.authMiddlewares.isAuthorized,
			this.link({ route: this.updateFolder })
		);
		this.router.put(
			"/update-editors/:id",
			this.authMiddlewares.isAuthorized,
			this.link({ route: this.updateEditors })
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

	private getFoldersByParentId: RequestHandler<{ id: number }, BaseResponse<IFolder[]>> = async (
		req,
		res,
		next
	) => {
		try {
			const body = { id: req.params.id, name: req.body.name };
			const validatedBody = getByParentIdSchema.safeParse(body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			//  @ts-ignore
			const user = req.user as IUser;
			const { id, name } = validatedBody.data;

			const result = await this.foldersService.getListByParentId(user.id, id, name);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};

	private updateFolder: RequestHandler<{ id: number }, BaseResponse<IFolder>> = async (req, res, next) => {
		try {
			const body = { ...req.body, id: req.params.id };
			const validatedBody = updateFolderSchema.safeParse(body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			const result = await this.foldersService.update(validatedBody.data);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};

	private updateEditors: RequestHandler<{ id: number }, BaseResponse<IFolder>> = async (req, res, next) => {
		try {
			const body = { ...req.body, id: req.params.id };
			const validatedBody = updateFolderEditorsSchema.safeParse(body);

			if (!validatedBody.success) {
				throw new InvalidParameterError("Bad request");
			}

			const { id, editorsIds } = validatedBody.data;

			const result = await this.foldersService.updateEditors(id, editorsIds);

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};
}
