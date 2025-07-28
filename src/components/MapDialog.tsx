import clsx from "clsx";
import { Show } from "solid-js";
import { state } from "../store/state";

export const MapDialog = () => {
	return (
		<dialog class={clsx("modal", state.state !== "Idle" && "modal-open")}>
			<div class="modal-box">
				<h3 class="font-bold text-lg">
					{state.state === "Downloading" ? "Downloading" : "Opening"}{" "}
					<Show when={state.state !== "Idle"}>
						<span
							innerHTML={(state.state !== "Idle" && state.map.name) || ""}
						/>
					</Show>
				</h3>
				<p class="py-4">
					{state.state === "Downloading" && (
						<>
							<Show when={state.contentLength !== 0}>
								<span>
									Progress:{" "}
									{(
										(state.downloadProgress / state.contentLength) *
										100
									).toFixed(2)}
									% ({(state.downloadProgress / 1000 / 1000).toFixed(1)}/
									{(state.contentLength / 1000 / 1000).toFixed(1)}) MB
								</span>
							</Show>

							<progress
								class="progress progress-success"
								max={state.contentLength}
								value={state.downloadProgress}
							/>
						</>
					)}
				</p>
			</div>
		</dialog>
	);
};
