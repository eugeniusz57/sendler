import db from "@/db";

import { QueryResult } from "pg";

export default async function fetchUserPendingSms(id: number): Promise<number | null | undefined> {
	try {
		const res: QueryResult<any> = await db.query(`SELECT get_pending_sms_by_user(${id}) AS delevered_sms`
		);
		if (!res) {
			return null;
		};

		const sentSms = Number(res.rows[0].delevered_sms);
		return sentSms;
	} catch (error) { };
};