import db from "@/db";

import { QueryResult } from "pg";
import { IGroupName } from "@/globaltypes/types";

export default async function fetchUserGroupsName(id: number): Promise<QueryResult<IGroupName>> {
	const res = await db.query(
		`SELECT group_name FROM send_groups WHERE user_id=${id}`
	);
	console.log(res.rows)
	return res;
};
