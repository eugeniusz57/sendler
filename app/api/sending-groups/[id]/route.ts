import { NextResponse } from "next/server";
import db from "@/db";

import HttpError from "@/helpers/HttpError";
import insertNewClient from "@/services/insertNewClient/insertNewClient";
import insertGroupMember from "@/services/insertGroupMember/insertGroupMember";

import {
	ITel,
	IGroupId,
	QueryResult,
	IClient,
	IUserId,
	ITelRes
} from "@/globaltypes/types";
import { IQieryParamsUpdateGroup } from "./types";

// get one group with id from params
export async function GET(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<{ message: string; }> | NextResponse<{ clients: IClient[]; }>> {

	const groupId = Number(params.id);

	//checking group_id existense
	const groupsRes: QueryResult<IGroupId> = (await db.query("SELECT group_id FROM send_groups"));
	const groupsId: IGroupId[] = groupsRes.rows;

	if (
		!groupsId.find(
			(group: IGroupId) => group.group_id === groupId
		)
	) {
		return HttpError(400, `The group with id = ${groupId} does not exist`);
	}

	try {
		const groupClients: QueryResult<IClient> = await db.query(
			`SELECT groups_members.client_id, clients.tel xport
		FROM groups_members
		JOIN clients ON groups_members.client_id = clients.client_id
		WHERE groups_members.group_id = ${groupId} `
		);

		return NextResponse.json(
			{ clients: groupClients.rows },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to get a groups list" },
			{ status: 500 }
		);
	}
}

// delete one group with id from params
export async function DELETE(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<{ message: string; }>> {
	const groupId = Number(params.id);

	//checking group_id existense
	const groupsIdRes: QueryResult<IGroupId> = (await db.query("SELECT group_id FROM send_groups"));
	const groupsIdInDatabase: IGroupId[] = groupsIdRes.rows;

	if (
		!groupsIdInDatabase.find(
			(groupIdInDatabase: IGroupId) => groupIdInDatabase.group_id === groupId
		)
	) {
		return HttpError(400, `The group with id = ${groupId} does not exist`);
	}

	try {
		await db.query(
			`DELETE FROM send_groups
		WHERE send_groups.group_id = ${groupId}`
		);

		return NextResponse.json(
			{ message: `Group with id = ${groupId} is deleted` },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to delete a group" },
			{ status: 500 }
		);
	}
}

//update one group with id from params
export async function PUT(request: Request, { params }: { params: { id: string } }): Promise<NextResponse<{ message: string; }> | NextResponse<string>> {
	const { clients }: IQieryParamsUpdateGroup = await request.json();
	const groupId = Number(params.id);

	//checking the content of the entered group
	if (clients.length === 0) {
		return HttpError(400, `The clients list is empty`);
	}

	//checking group existense
	const groupsIdRes: QueryResult<IGroupId> = await db.query(`SELECT group_id FROM send_groups`);
	const groupsIdInDatabase: IGroupId[] = groupsIdRes.rows;

	if (
		!groupsIdInDatabase.find(
			(groupIdInDatabase: IGroupId) => groupIdInDatabase.group_id === groupId
		)
	) {
		return HttpError(400, `The group with id = ${groupId} does not exist`);
	}

	try {
		await db.query(
			`DELETE FROM groups_members
    WHERE groups_members.group_id = ${groupId}`
		);

		const userIdRes: QueryResult<IUserId> = await db.query(
			`SELECT user_id FROM send_groups WHERE send_groups.group_id = ${groupId}`
		);

		const userId = userIdRes.rows[0].user_id;

		const userClientsRes: QueryResult<ITelRes> = await db.query(
			`SELECT tel FROM clients WHERE user_id = ${userId}`
		);

		//checking whether a client exists in the user's client list
		//and adding client
		const userClients = userClientsRes.rows;

		for (const client of clients) {
			const tel = client.tel;

			if (!userClients.find((userClient: ITelRes) => userClient.tel === String(tel))) {
				const res: any = await insertNewClient(client, userId);
				if (res) {
					return NextResponse.json({ message: `Failed to update a group with id = ${groupId}` + " - " + res.message }, { status: 500 });
				}
			}
			const res: any = await insertGroupMember(tel, userId, groupId);
			if (res) {
				return NextResponse.json({ message: "Failed to create a new group" + " - " + res.message }, { status: 500 });
			}
		}

		return NextResponse.json(
			{ message: `The group is updated` },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: `Failed to update a group with id = ${groupId}` }, {
			status: 500,
		});
	}
}
