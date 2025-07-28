import { fetch } from "@tauri-apps/plugin-http";

export type Map = {
	author: string;
	name: string;
	filename: string;
	mapId: string;
	mapUid: string;
	fileUrl: string;
	thumbnailUrl: string;
};

export const fetchTOTD = async (idx: number, abortSignal: AbortSignal) => {
	const res = await fetch(`https://trackmania.io/api/totd/${idx}`, {
		signal: abortSignal,
	});

	const data = await res.json();

	return data as {
		year: number;
		month: number;
		lastday: number;
		days: Array<{
			campaignid: number;
			map: Map;
			weekday: number;
			monthday: number;
			leaderboarduid: string;
		}>;
	};
};

export const fetchSeasons = async () => {
	const res = await fetch("https://trackmania.io/api/campaigns/seasonal/0");

	const data = await res.json();

	return data as {
		page: number;
		pageCount: number;
		campaigns: Array<{
			official: boolean;
			seasonal: boolean;
			weekly: boolean;
			id: number;
			name: string;
			timestamp: number;
			mapcount: number;
			tracked: boolean;
		}>;
	};
};

export const fetchSeason = async (id: number) => {
	const res = await fetch(`https://trackmania.io/api/campaign/seasonal/${id}`);

	const data = await res.json();

	return data as {
		clubid: number;
		creationtime: number;
		id: number;
		leaderboarduid: string;
		name: string;
		playlist: Array<Map>;
	};
};

export const fetchRandomMap = async () => {
	const res = await fetch(
		"https://trackmania.exchange/api/maps?random=1&fields=OnlineMapId,Name,GbxMapName&count=1",
	);

	const data = await res.json();

	return data as {
		More: boolean;
		Results: [{ OnlineMapId: string; Name: string; GbxMapName: string }];
	};
};

export const fetchWeeklyCampaigns = async () => {
	const res = await fetch("https://trackmania.io/api/campaigns/weekly/0");

	const data = await res.json();

	return data as {
		page: number;
		pageCount: number;
		campaigns: Array<{
			official: boolean;
			seasonal: boolean;
			weekly: boolean;
			id: number;
			name: string;
			timestamp: number;
			mapcount: number;
			tracked: boolean;
		}>;
	};
};

export const fetchClubs = async (props: {
	page: number;
	query: string | null;
}) => {
	const url = new URL(`https://trackmania.io/api/clubs/${props.page}`);

	if (props.query) url.searchParams.append("search", props.query);

	const res = await fetch(url);

	const data = await res.json();

	return data as {
		page: number;
		pageCount: number;
		clubs: Array<{
			id: number;
			name: string;
			iconUrl: string;
			verticalUrl: string;
			verified: boolean;
		}>;
	};
};

export const fetchClubCampaigns = async (props: {
	page: number;
	query: string | null;
}) => {
	const url = new URL(`https://trackmania.io/api/campaigns/club/${props.page}`);

	if (props.query) url.searchParams.append("search", props.query);

	const res = await fetch(url);

	const data = await res.json();

	console.log({ data });

	return data as {
		page: number;
		pageCount: number;
		campaigns: Array<{
			official: boolean;
			seasonal: boolean;
			weekly: boolean;
			id: number;
			name: string;
			clubid: number;
			timestamp: number;
			mapcount: number;
			tracked: boolean;
			mediaurl: string;
		}>;
	};
};

export const fetchClubCampaign = async (props: {
	clubId: number;
	id: number;
}) => {
	const res = await fetch(
		`https://trackmania.io/api/campaign/${props.clubId}/${props.id}`,
	);

	const data = await res.json();
	console.log({ data });
	return data as {
		clubid: number;
		clubname: string;
		id: number;
		leaderboarduid: string;
		media: string;
		name: string;
		playlist: Array<Map>;
		publishtime: number;
		tracked: boolean;
	};
};

export const fetchWeeklyCampaign = async (id: number, signal: AbortSignal) => {
	const res = await fetch(`https://trackmania.io/api/campaign/weekly/${id}`, {
		signal,
	});

	const data = await res.json();

	return data as {
		id: number;
		name: string;
		media: string;
		creationtime: number;
		publishtime: number;
		clubid: number;
		leaderboarduid: number;
		playlist: Array<Map>;
	};
};

export const downloadMap = async (fileUrl: string) => {
	const res = await fetch(fileUrl);

	return res;
};
