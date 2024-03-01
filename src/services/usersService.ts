import { UsersDb } from "../database/usersDb";

export class UsersService {
	private usersDb: UsersDb;

	constructor(usersDb: UsersDb) {
		this.usersDb = usersDb;
	}

	getAll = async () => {
		const users = await this.usersDb.getAllUsers();

		return users.map((user) => ({ id: user.id, email: user.email }));
	};
}
