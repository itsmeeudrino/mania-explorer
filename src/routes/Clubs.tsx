import { debounce } from "@solid-primitives/scheduled";
import { A } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";

import { createSignal, For, Show } from "solid-js";
import { fetchClubCampaigns } from "../api/Trackmania";
import { stripStyles } from "../mod/Trackmania";

export const Clubs = () => {
	const [page, setPage] = createSignal(0);
	const [query, setQuery] = createSignal(null as string | null);

	const clubs = useQuery(() => ({
		queryKey: ["clubs", page(), query()] as const,
		queryFn: ({ queryKey: [, page, query] }) =>
			fetchClubCampaigns({ page, query }),
	}));

	const previousPage = () => page() > 0;
	const nextPage = () => clubs.data && page() + 1 <= clubs.data?.pageCount - 1;

	const updateQuery = debounce((val: string | null) => setQuery(val), 250);

	return (
		<div class="flex flex-col px-10 py-8">
			<label class="input mx-6 my-4">
				<svg
					class="h-[1em] opacity-50"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
				>
					<title>Search icon</title>
					<g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.3-4.3"></path>
					</g>
				</svg>
				<input
					onInput={(e) => updateQuery(e.currentTarget.value || null)}
					type="search"
					required
					placeholder="Search"
				/>
			</label>
			<div class="flex px-5 py-2">
				<button
					class="btn btn-soft btn-warning"
					onClick={() => setPage((m) => m - 1)}
					type="button"
					disabled={!previousPage()}
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
				</button>

				<button
					class="btn btn-soft ms-4 btn-warning"
					onClick={() => setPage((s) => s + 1)}
					type="button"
					disabled={!nextPage()}
				>
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
			</div>
			<Show when={clubs.data} fallback={<div class="loading loading-xl" />}>
				<div class="flex flex-wrap -skew-x-2 gap-3">
					<For each={clubs.data?.campaigns}>
						{(campaign) => (
							<A
								href={`/clubs/${campaign.clubid}/${campaign.id}`}
								class="cursor-pointer relative transition-all outline-3 hover:outline-offset-3 outline-transparent hover:outline-success group w-48 h-24 overflow-hidden rounded-tl-lg bg-black/30"
							>
								<img
									src={
										campaign.mediaurl
											? campaign.mediaurl?.replace("small", "large")
											: "/no_icon.jpg"
									}
									alt="Club icon"
									width="192"
									height="96"
									class="object-cover rounded-tl-lg w-48 h-24 rounded-br-lg transition-transform group-hover:scale-115"
								/>
								<div class="absolute bottom-1 left-1">
									<div
										class="p-2 leading-3 text-xs font-bold bg-black/40 backdrop-blur-sm rounded"
										innerHTML={stripStyles(campaign.name)}
									></div>
								</div>
							</A>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
};
