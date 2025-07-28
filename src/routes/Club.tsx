import { A, useParams } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";

import clsx from "clsx";

import { createEffect, createSignal, For, on, Show } from "solid-js";
import { fetchClubCampaign } from "../api/Trackmania";
import { launchMap, stripStyles } from "../mod/Trackmania";

export const Club = () => {
	const params = useParams();

	const campaign = useQuery(() => ({
		queryKey: ["clubCampaign", params.clubId, params.id],
		queryFn: () =>
			fetchClubCampaign({
				clubId: Number(params.clubId),
				id: Number(params.id),
			}),
	}));

	createEffect(() => {
		if (campaign.data) {
			for (const map of campaign.data.playlist)
				new Image().src = map.thumbnailUrl;
		}
	});

	const [hoveredMap, setHoveredMap] = createSignal(0);

	const hoveredMapObj = () =>
		campaign.data?.playlist[hoveredMap() ?? -1] ||
		campaign.data?.playlist.slice(-1)[0];

	return (
		<div class="flex flex-col px-10 py-8">
			<A href="/clubs/" class="btn btn-soft btn-warning self-start my-3">
				Back
			</A>

			<Show when={campaign.data} fallback={<div class="loading loading-xl" />}>
				{(data) => (
					<>
						<div class="flex">
							<div class="flex flex-col flex-1">
								<img
									alt={`${campaign.data?.name} cover`}
									src={data().media}
									width="480"
									class={clsx(
										"aspect-[6/2] object-cover rounded-lg mb-4",
										!data().media && "hidden",
									)}
								/>
								<h1 class="flex text-4xl w-[480px] font-semibold">
									{data().name}

									<button
										class="btn btn-soft btn-sm btn-primary ms-auto"
										type="button"
										disabled={campaign.isFetching}
										onClick={() => campaign.refetch()}
									>
										{campaign.isFetching ? (
											<div class="loading loading-xs" />
										) : (
											"Refresh"
										)}
									</button>
								</h1>
								<div class="flex">
									<div class="py-8 gap-4 flex flex-col">
										<div class="grid grid-flow-col grid-rows-[repeat(5,38px)] gap-x-5 grid-cols-[repeat(5,80px)] gap-4">
											<For each={data().playlist}>
												{(map, i) => (
													<button
														type="button"
														class="btn btn-soft btn-success"
														onMouseEnter={() => setHoveredMap(i())}
														onClick={() => {
															launchMap({
																id: map.mapId,
																name: stripStyles(map.name),
																randomMap: false,
															});
														}}
													>
														{String(i() + 1).padStart(2, "0")}
													</button>
												)}
											</For>
										</div>
									</div>
								</div>
							</div>
							<div class="ms-auto hidden xl:flex rounded w-[320px] h-[320px] relative select-none">
								<div class="grid rounded-2xl bg-white/30 w-full h-full place-items-center absolute">
									<div class="loading loading-xl" />
								</div>
								<img
									class="z-10 rounded-2xl"
									ref={(el) => {
										createEffect(
											on(hoveredMapObj, () => {
												el.classList.add("opacity-0");
											}),
										);
									}}
									src={hoveredMapObj()?.thumbnailUrl}
									onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
									alt="Selected map thumbnail"
								/>
								<div class="flex z-10 flex-col absolute top-0 left-0 p-2 h-full">
									<span
										class={clsx(
											"font-bold text-white backdrop-blur-xs bg-black/20 rounded-lg text-shadow-lg mt-auto py-1 px-2",
											!hoveredMapObj() && "hidden",
										)}
										innerHTML={stripStyles(hoveredMapObj()?.name)}
									/>
								</div>
							</div>
						</div>
					</>
				)}
			</Show>
		</div>
	);
};
