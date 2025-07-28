import clsx from "clsx";
import { createEffect, createSignal, For, on, Show } from "solid-js";
import { fetchSeason, fetchSeasons } from "../api/Trackmania";
import { launchMap, stripStyles } from "../mod/Trackmania";
import { useQuery } from "@tanstack/solid-query";

const COLORS = [
	"bg-white",
	"bg-success",
	"bg-blue-500",
	"bg-error",
	"bg-black",
];

export const Seasons = () => {
	const seasons = useQuery(() => ({
		queryKey: ["seasons"],
		queryFn: fetchSeasons,
		staleTime: Infinity,
	}));

	const [currentSeason, setCurrentSeason] = createSignal(0);

	createEffect(
		on(currentSeason, () => {
			setHoveredMap(-1);
		}),
	);

	const seasonObj = () => seasons.data?.campaigns[currentSeason() ?? -1];

	const previousSeason = () => seasons.data?.campaigns[currentSeason() + 1];
	const nextSeason = () => seasons.data?.campaigns[currentSeason() - 1];

	const campaign = useQuery(() => ({
		queryKey: ["season", seasonObj()?.id] as const,
		queryFn: ({ queryKey: [, seasonId] }) =>
			seasonId ? fetchSeason(seasonId) : undefined,
		staleTime: Infinity,
	}));

	const seasonCover = () => {
		const season = seasonObj();

		if (season?.name.includes("Winter"))
			return "https://www.trackmania.com/build/images/winter.bfe568a7.jpg";
		if (season?.name.includes("Spring"))
			return "https://www.trackmania.com/build/images/spring.f113304b.jpg";
		if (season?.name.includes("Summer"))
			return "https://www.trackmania.com/build/images/summer.c97b669a.jpg";

		return "https://www.trackmania.com/build/images/fall.e267694d.jpg";
	};

	const [hoveredMap, setHoveredMap] = createSignal(0);

	const hoveredMapObj = () =>
		campaign.data?.playlist[hoveredMap() ?? -1] ||
		campaign.data?.playlist.slice(-1)[0];

	const imagePool = () =>
		campaign.data?.playlist.map(
			(map) =>
				[
					map.mapId,
					<div class="ms-auto hidden xl:flex rounded w-[320px] h-[320px] relative top-[-218px] select-none">
						<div class="grid rounded-2xl bg-white/30 w-full h-full place-items-center absolute">
							<div class="loading loading-xl" />
						</div>
						<img
							ref={(el) => {
								createEffect(() => {
									if (hoveredMap()) {
										el.classList.add("opacity-0");
									}
								});
							}}
							class="rounded-2xl z-10 object-cover w-[320px] h-[320px]"
							src={map.thumbnailUrl}
							loading="eager"
							onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
							alt="Selected map thumbnail"
						/>
						<div class="flex z-10 flex-col absolute top-0 left-0 p-2 h-full">
							<span
								innerHTML={stripStyles(map?.name)}
								class="font-bold text-white backdrop-blur-xs bg-black/20 rounded-lg text-shadow-lg mt-auto py-1 px-2"
							/>
						</div>
					</div>,
				] as const,
		);

	const currentImage = () =>
		imagePool()?.find(([mapId]) => hoveredMapObj()?.mapId === mapId)?.[1];

	return (
		<div class="flex flex-col px-10 py-8">
			<Show when={seasons.data} fallback={<div class="loading loading-xl" />}>
				<img
					alt={`${campaign.data?.name} cover`}
					src={seasonCover()}
					width="480"
					class="aspect-[6/2] object-cover rounded-lg mb-4"
				/>
				<h1 class="flex text-4xl w-[480px] font-semibold">
					{seasonObj()?.name}

					<button
						class="btn btn-soft btn-sm btn-primary ms-auto"
						type="button"
						disabled={seasons.isFetching || campaign.isFetching}
						onClick={() => seasons.refetch()}
					>
						{seasons.isFetching || campaign.isFetching ? (
							<div class="loading loading-xs" />
						) : (
							"Refresh"
						)}
					</button>
				</h1>
				<div class="flex">
					<div class="py-8 gap-4 flex flex-col">
						<div class="flex gap-5 rounded">
							<For each={COLORS}>
								{(color) => <div class={clsx(color, "w-[80px] h-1 mt-auto")} />}
							</For>
						</div>
						<div class="grid grid-flow-col grid-rows-[repeat(5,38px)] gap-x-5 grid-cols-[repeat(5,80px)] gap-4">
							<For each={Array(25).fill(true)}>
								{(_, i) => (
									<button
										type="button"
										class="btn btn-soft btn-success"
										onMouseEnter={() => setHoveredMap(i())}
										onClick={() => {
											const map = campaign.data?.playlist[i()];

											map &&
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
					<Show
						when={!campaign.isLoading}
						fallback={
							<div class="ms-auto hidden xl:flex rounded w-[320px] h-[320px] relative top-[-218px] select-none">
								<div class="grid rounded-2xl bg-white/30 w-full h-full place-items-center absolute">
									<div class="loading loading-xl" />
								</div>
							</div>
						}
					>
						{currentImage()}
					</Show>
				</div>
				<div class="flex w-[480px]">
					<Show when={previousSeason()}>
						{(previousSeason) => (
							<button
								class="btn btn-soft btn-warning"
								onClick={() => setCurrentSeason((m) => m + 1)}
								type="button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="18"
									width="18"
									viewBox="0 -960 960 960"
									fill="currentColor"
								>
									<title>Go back icon</title>
									<path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
								</svg>
								{previousSeason().name}
							</button>
						)}
					</Show>

					<Show when={nextSeason()}>
						{(nextSeason) => (
							<button
								class="btn btn-soft ms-auto btn-warning"
								onClick={() => setCurrentSeason((s) => s - 1)}
								type="button"
							>
								{nextSeason().name}
								<svg
									class="rotate-180"
									xmlns="http://www.w3.org/2000/svg"
									height="18"
									width="18"
									viewBox="0 -960 960 960"
									fill="currentColor"
								>
									<title>Go next icon</title>
									<path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
								</svg>
							</button>
						)}
					</Show>
				</div>
			</Show>
		</div>
	);
};
