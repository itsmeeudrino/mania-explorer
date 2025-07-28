import { A } from "@solidjs/router";

export const Aside = () => {
	return (
		<aside class="flex flex-col bg-base-200 w-[240px] h-full p-2 gap-2">
			<span class="font-mono font-semibold text-base-content py-2">Maps</span>
			<A
				class="btn btn-soft btn-info justify-start font-semibold"
				activeClass="btn-active"
				href="/"
				end
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="18"
					width="18"
					viewBox="0 -960 960 960"
					fill="currentColor"
				>
					<title>Calendar icon</title>
					<path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
				</svg>
				TOTD
			</A>
			<A
				class="btn btn-soft btn-warning justify-start font-semibold"
				href="/seasons"
				activeClass="btn-active"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="18"
					width="18"
					viewBox="0 -960 960 960"
					fill="currentColor"
				>
					<title>Trophy icon</title>

					<path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
				</svg>
				Seasons
			</A>
			<A
				class="btn btn-soft btn-secondary justify-start font-semibold"
				href="/weekly-shorts"
				activeClass="btn-active"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="18"
					width="18"
					viewBox="0 -960 960 960"
					fill="currentColor"
				>
					<title>Gamepad icon</title>

					<path d="M480-654Zm174 174Zm-348 0Zm174 174Zm0-234L360-660v-220h240v220L480-540Zm180 180L540-480l120-120h220v240H660Zm-580 0v-240h220l120 120-120 120H80ZM360-80v-220l120-120 120 120v220H360Zm120-574 40-40v-106h-80v106l40 40ZM160-440h106l40-40-40-40H160v80Zm280 280h80v-106l-40-40-40 40v106Zm254-280h106v-80H694l-40 40 40 40Z" />
				</svg>
				Weekly Shorts
			</A>
			<A
				class="btn btn-soft btn-primary justify-start font-semibold"
				href="/clubs"
				activeClass="btn-active"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="18"
					width="18"
					viewBox="0 -960 960 960"
					fill="currentColor"
				>
					<title>Club icon</title>
					<path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" />
				</svg>
				Clubs
			</A>
		</aside>
	);
};
