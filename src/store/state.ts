import { createStore } from "solid-js/store";

export type StoredMap = {
	name: string;
	id: string;
	randomMap: boolean;
};

type State =
	| {
			state: "Downloading";
			downloadProgress: number;
			contentLength: number;
			map: StoredMap;
	  }
	| { state: "Idle" }
	| { state: "Opening"; map: StoredMap };

export const [state, setState] = createStore({ state: "Idle" } as State);
