import { invoke } from "@tauri-apps/api/core";
// @ts-ignore tmText does not provide types
import { tmText } from "tm-text";
import { downloadMap } from "../api/Trackmania";
import { type StoredMap, setState } from "../store/state";

export const launchMap = async (map: StoredMap) => {
	const mapExists = await invoke<boolean>("map_exists", { mapId: map.id });

	if (!mapExists) {
		setState({
			state: "Downloading",
			map,
			downloadProgress: 0,
			contentLength: 0,
		});

		const res = await downloadMap(
			`https://core.trackmania.nadeo.live/maps/${map.id}/file`,
		);

		const contentLength = res.headers.get("Content-Length");

		setState({
			state: "Downloading",
			map,
			downloadProgress: 0,
			contentLength: Number(contentLength),
		});

		const stream = res.body;
		const reader = stream?.getReader();

		if (!reader) throw Error("Reader could not be obtained");

		const chunks = [];

		let receivedLength = 0;

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				console.log("Stream finished.");
				break;
			}

			chunks.push(value);

			receivedLength += value.length;

			setState({ state: "Downloading", map, downloadProgress: receivedLength });
		}

		const allChunks = new Uint8Array(receivedLength);
		let position = 0;

		for (const chunk of chunks) {
			allChunks.set(chunk, position);
			position += chunk.length;
		}

		setState({ state: "Opening", map });

		await invoke("save_map", {
			mapId: map.id,
			bytes: allChunks,
		});

		setTimeout(() => {
			setState({ state: "Idle" });
		}, 1000);
	} else {
		setState({ state: "Opening", map });

		await invoke("open_map", { mapId: map.id });

		setTimeout(() => {
			setState({ state: "Idle" });
		}, 1000);
	}
};

export const stripStyles = (text: string | undefined) => {
	if (!text) return "";

	const a = tmText(text);

	return a.htmlify();
};
