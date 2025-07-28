import { useQuery } from "@tanstack/solid-query";
import { fetchWeeklyCampaign, fetchWeeklyCampaigns } from "../api/Trackmania";
import { createEffect, createSignal, For, on, Show } from "solid-js";
import { launchMap, stripStyles } from "../mod/Trackmania";
import clsx from "clsx";

export const Weekly = () => {
	const weeks = useQuery(() => ({
		queryKey: ["weekly_shorts"],
		queryFn: () => fetchWeeklyCampaigns(),
		staleTime: 60_000,
	}));

	const [currentWeek, setCurrentWeek] = createSignal(0);

	const previousWeek = () => weeks.data?.campaigns[currentWeek() + 1];
	const nextWeek = () => weeks.data?.campaigns[currentWeek() - 1];

	const weekCampaign = useQuery(() => ({
		queryKey: ["weekly_campaign", currentWeek(), weeks.data],
		queryFn: (e) =>
			// biome-ignore lint/style/noNonNullAssertion: campaigns[currentWeek()] can't be null cuz it's verified in navigation
			fetchWeeklyCampaign(weeks.data?.campaigns[currentWeek()]?.id!, e.signal),
		staleTime: Infinity,
	}));

	return (
		<div class="flex flex-col px-10 py-8">
			<h1 class="flex text-4xl font-semibold">
				{weeks.data?.campaigns[currentWeek()]?.name}
				<button
					class={clsx(
						"btn btn-soft btn-sm btn-primary ms-auto",
						currentWeek() !== 0 && "hidden",
					)}
					type="button"
					disabled={weeks.isLoading || weeks.isRefetching}
					onClick={() => weeks.refetch()}
				>
					{weeks.isLoading || weeks.isRefetching ? (
						<div class="loading loading-xs" />
					) : (
						"Refresh"
					)}
				</button>
			</h1>
			<div class="flex py-8 gap-2 justify-around -skew-x-4 h-[320px]">
				<Show
					when={weekCampaign.data}
					fallback={<div class="loading loading-xl mx-auto" />}
				>
					{(data) => (
						<For each={Array(5)}>
							{(_, i) => (
								<button
									type="button"
									onClick={() => {
										const map = data().playlist[i()];

										map &&
											launchMap({
												id: map.mapId,
												name: stripStyles(map.name),
												randomMap: false,
											});
									}}
									class="flex active:scale-98 group cursor-pointer relative w-40 h-60 overflow-hidden rounded outline-2 outline-offset-2 outline-transparent transition-all hover:outline-success"
								>
									<div class="absolute top-0 left-0 w-full h-full bg-transparent group-hover:bg-black/30 transition-colors z-10" />
									<div class="grid rounded-2xl w-full h-full place-items-center absolute">
										<div class="loading loading-xl" />
									</div>
									<img
										class="object-cover rounded group-hover:scale-115 transition-transform z-10"
										ref={(el) => {
											createEffect(
												on(currentWeek, () => {
													el.classList.add("opacity-0");
												}),
											);
										}}
										onLoad={(e) =>
											e.currentTarget.classList.remove("opacity-0")
										}
										width="192"
										height="256"
										alt="Weekly map icon"
										src={data().playlist?.[i()]?.thumbnailUrl}
									/>
									<div
										class={clsx(
											"bg-black/30 w-[calc(100%-8px)] z-20 text-white text-sm text-start font-bold left-1 rounded bottom-1 backdrop-blur-xs p-2 leading-4 absolute",
											weekCampaign.isLoading && "hidden",
										)}
										innerHTML={stripStyles(data().playlist?.[i()]?.name)}
									/>
								</button>
							)}
						</For>
					)}
				</Show>
			</div>
			<div class="flex">
				<Show when={previousWeek()}>
					{(previousWeek) => (
						<button
							class="btn btn-soft btn-warning"
							onClick={() => setCurrentWeek((w) => w + 1)}
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
							{previousWeek().name}
						</button>
					)}
				</Show>

				<Show when={nextWeek()}>
					{(nextWeek) => (
						<button
							class="btn btn-soft ms-auto btn-warning"
							onClick={() => setCurrentWeek((w) => w - 1)}
							type="button"
						>
							{nextWeek().name}
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
		</div>
	);
};
