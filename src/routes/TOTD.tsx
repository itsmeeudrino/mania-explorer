import {
	eachMonthOfInterval,
	endOfMonth,
	format,
	getDate,
	getDay,
	getDaysInMonth,
} from "date-fns";
import {
	createEffect,
	createMemo,
	createSignal,
	For,
	on,
	Show,
} from "solid-js";
import { fetchTOTD } from "../api/Trackmania";
import { launchMap, stripStyles } from "../mod/Trackmania";
import { useQuery } from "@tanstack/solid-query";
import clsx from "clsx";

const DAYS_OF_WEEK = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const LAUNCH_DATE = new Date("July 2020");
const TODAY = new Date();

const MONTHS = eachMonthOfInterval({
	start: LAUNCH_DATE,
	end: endOfMonth(TODAY),
});

const getMonthTitle = (month: Date) => format(month, "MMMM yyyy");

export const TOTD = () => {
	const [currentMonth, setCurrentMonth] = createSignal(
		MONTHS[MONTHS.length - 1] as Date,
	);

	const totd = useQuery(() => ({
		queryKey: ["totd", MONTHS.slice().reverse().indexOf(currentMonth())],
		queryFn: (e) =>
			fetchTOTD(MONTHS.slice().reverse().indexOf(currentMonth()), e.signal),
		staleTime:
			MONTHS.slice().reverse().indexOf(currentMonth()) === 0
				? 60_000
				: Infinity,
	}));

	createEffect(() => {
		if (totd.data) {
			for (const map of totd.data.days) new Image().src = map.map.thumbnailUrl;
		}
	});

	const [hoveredMap, setHoveredMap] = createSignal(0);

	createEffect(
		on(currentMonth, () => {
			setHoveredMap(-1);
		}),
	);

	const hoveredMapObj = createMemo(
		() => totd.data?.days[hoveredMap() ?? -1] || totd.data?.days.slice(-1)[0],
	);

	const previousMonth = () => MONTHS[MONTHS.indexOf(currentMonth()) - 1];
	const nextMonth = () => MONTHS[MONTHS.indexOf(currentMonth()) + 1];

	const fillerDays = () => {
		const day = getDay(currentMonth());

		return day === 0 ? 6 : day - 1;
	};

	const isDisabled = (idx: number) => {
		const isCurrentMonth = nextMonth();

		if (isCurrentMonth) return false;

		const isPreviousDays = getDate(TODAY) <= idx;

		if (isPreviousDays) return true;

		const isToday = getDate(TODAY) === idx + 1;

		const isDataAvailable = totd.data?.days.length === idx;

		return isToday ? isDataAvailable : false;
	};

	return (
		<div class="flex flex-col px-10 py-8">
			<h1 class="flex text-4xl font-semibold w-[608px]">
				{getMonthTitle(currentMonth())}
				<button
					class="btn btn-soft btn-sm btn-primary ms-auto"
					type="button"
					disabled={totd.isLoading || totd.isRefetching}
					onClick={() => totd.refetch()}
				>
					{totd.isLoading || (totd.isRefetching && !totd.isFetching) ? (
						<div class="loading loading-xs" />
					) : (
						"Refresh"
					)}
				</button>
			</h1>
			<div class="flex">
				<div class="py-8 grid grid-rows-[repeat(7,38px)] grid-cols-[repeat(7,80px)] gap-2">
					<For each={DAYS_OF_WEEK}>
						{(day) => (
							<span class="text-sm font-bold text-center flex justify-center items-center">
								{day}
							</span>
						)}
					</For>
					<For each={Array(fillerDays())}>{() => <div />}</For>
					<For each={Array(getDaysInMonth(currentMonth())).fill(true)}>
						{(_, i) => (
							<button
								type="button"
								class="btn btn-soft btn-success"
								onMouseEnter={() => setHoveredMap(i())}
								onClick={() => {
									const map = totd.data?.days[i()];

									map &&
										launchMap({
											id: map.map.mapId,
											name: stripStyles(map.map.name),
											randomMap: false,
										});
								}}
								disabled={isDisabled(i())}
							>
								{i() + 1}
							</button>
						)}
					</For>
				</div>
				<div class="ms-auto hidden xl:flex rounded h-[320px] relative select-none">
					<div class="grid rounded-2xl bg-white/30 w-full h-full place-items-center absolute">
						<div class="loading loading-xl" />
					</div>
					<img
						ref={(el) => {
							createEffect(
								on(hoveredMapObj, () => {
									el.classList.add("opacity-0");
								}),
							);
						}}
						class="rounded-2xl z-10 object-cover w-[320px] h-[320px]"
						src={hoveredMapObj()?.map.thumbnailUrl}
						onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
						alt="Selected map thumbnail"
					/>
					<div class="flex z-10 flex-col absolute top-0 left-0 p-2 h-full">
						<span
							class={clsx(
								"font-bold text-white backdrop-blur-xs bg-black/20 rounded-lg text-shadow-lg mt-auto py-1 px-2",
								!hoveredMapObj() && "hidden",
							)}
							innerHTML={stripStyles(hoveredMapObj()?.map.name)}
						/>
					</div>
				</div>
			</div>
			<div class="flex w-[608px]">
				<Show when={previousMonth()}>
					{(previousMonth) => (
						<button
							class="btn btn-soft btn-warning"
							onClick={() => setCurrentMonth(previousMonth())}
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
							{getMonthTitle(previousMonth())}
						</button>
					)}
				</Show>

				<Show when={nextMonth()}>
					{(nextMonth) => (
						<button
							class="btn btn-soft ms-auto btn-warning"
							onClick={() => setCurrentMonth(nextMonth())}
							type="button"
						>
							{getMonthTitle(nextMonth())}
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
