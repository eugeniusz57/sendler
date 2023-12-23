'use client';

import { redirect } from "next/navigation";

import { getUserGroups } from "@/app/utils";

import { IGroupDatabase } from "@/globaltypes/types";

type Props = {
	id: number | undefined;
}

export default function GroupsList({ id }: Props) {

	const A = async () => {
		const userGroups: IGroupDatabase[] | undefined = await getUserGroups(id);
		return userGroups;
	}

	console.log("AAAAAAAAA=", A());



	if (A === undefined) {
		console.log('Unable to fetch userGroups!');
		redirect('/')
	};

	return (
		<>
			<div className='flex w-full px-6 pt-4 pb-3 text-xl font-roboto font-normal bg-headerTable rounded-2xl'>
				<p className='mr-28'>Група</p>
				<p className='mr-24'>Оновлення</p>
				<p>Кількість</p>
			</div>
			{/* <ul>
				{.map((userGroup: IGroupDatabase) => (
					<li key={userGroup.user_id} className="flex py-3.5 text-xl font-montserrat font-normal border-b border-black">
						<div className="w-32 mx-8">{userGroup.group_name}</div>
						<div className="w-132 mr-12">{userGroup.group_create_date}</div>
						<div className="w-16 mr-8">{userGroup.number_members}</div>
						<button className="row-table__btn mr-4">Редагувати</button>
						<button className="row-table__btn mr-4">Видалити</button>
						<button className="row-table__btn mr-4">Експорт</button>
					</li>
				))}
			</ul> */}
		</>
	)
}

