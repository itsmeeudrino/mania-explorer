import { useQuery } from "@tanstack/solid-query";
import { fetchRandomMap } from "../api/Trackmania";
import { launchMap } from "../mod/Trackmania";
import { state } from "../store/state";

export const RandomMapButton = () => {
	const map = useQuery(() => ({
		queryKey: ["randomMap"],
		queryFn: () => fetchRandomMap(),
		staleTime: Infinity,
	}));

	return (
		<div
			class="ms-auto tooltip tooltip-left"
			data-tip="Play random map from Trackmania Exchange"
		>
			<button
				onClick={() => {
					// biome-ignore lint/style/noNonNullAssertion: results will always be of length=1
					const currentMap = map.data?.Results[0]!;

					launchMap({
						id: currentMap.OnlineMapId,
						name: currentMap.Name,
						randomMap: true,
					});

					map.refetch();
				}}
				disabled={map.isFetching || state.state !== "Idle"}
				type="button"
				class=" btn btn-square btn-soft btn-accent"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					width="24px"
					viewBox="0 -960 960 960"
					fill="currentColor"
				>
					<title>Dice icon</title>
					<path d="M640-260q25 0 42.5-17.5T700-320q0-25-17.5-42.5T640-380q-25 0-42.5 17.5T580-320q0 25 17.5 42.5T640-260ZM480-420q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420ZM320-580q25 0 42.5-17.5T380-640q0-25-17.5-42.5T320-700q-25 0-42.5 17.5T260-640q0 25 17.5 42.5T320-580ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
				</svg>
			</button>
		</div>
	);
};
