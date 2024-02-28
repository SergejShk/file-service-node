import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import dotenv from "dotenv";

import { UsersDb } from "./database/usersDb";
import { FoldersDb } from "./database/foldersDb";

import { AuthService } from "./services/authService";
import { FoldersService } from "./services/foldersService";

import { AuthMiddlewares } from "./middlewares/authMiddlewares";

import { AuthController } from "./controllers/AuthController";
import { FoldersController } from "./controllers/FoldersController";

import App from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const STAGE = process.env.STAGE;
const DATABASE_URL = process.env.DATABASE_URL;

const serverStart = async () => {
	try {
		const pool = new Pool({
			connectionString: DATABASE_URL,
			ssl: true,
		});
		const db = drizzle(pool, {
			logger: STAGE === "LOCAL" ? true : false,
		});

		// migrations
		await migrate(db, { migrationsFolder: "./migrations" });

		// dbs
		const usersDb = new UsersDb(db);
		const foldersDb = new FoldersDb(db);

		// services
		const authService = new AuthService(usersDb);
		const foldersService = new FoldersService(foldersDb);

		// middlewares
		const authMiddlewares = new AuthMiddlewares(usersDb);

		//controllers
		const authController = new AuthController(authService, authMiddlewares);
		const foldersController = new FoldersController(foldersService, authMiddlewares);

		const app = new App(PORT, [authController, foldersController]);

		app.listen();
	} catch (error: any) {
		console.log(error.message);
		process.exit(1);
	}
};

serverStart();
