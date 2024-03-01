import { RequestHandler } from "express";

import { Controller } from "./Controller";

import { UsersService } from "../services/usersService";

import { BaseResponse, okResponse } from "../api/baseResponses";

import { AuthMiddlewares } from "../middlewares/authMiddlewares";

import { IUser } from "../interfaces/auth";

export class UsersController extends Controller {
	usersService: UsersService;
	authMiddlewares: AuthMiddlewares;

	constructor(usersService: UsersService, authMiddlewares: AuthMiddlewares) {
		super("/users");

		this.authMiddlewares = authMiddlewares;
		this.usersService = usersService;

		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get("/all", this.authMiddlewares.isAuthorized, this.link({ route: this.getUsersList }));
	}

	private getUsersList: RequestHandler<{}, BaseResponse<IUser[]>> = async (req, res, next) => {
		try {
			const result = await this.usersService.getAll();

			return res.status(200).json(okResponse(result));
		} catch (e) {
			next(e);
		}
	};
}
