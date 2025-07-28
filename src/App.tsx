import { Router, Route } from "@solidjs/router";
import type { ParentProps } from "solid-js";
import { Aside } from "./components/Aside";
import { TOTD } from "./routes/TOTD";
import { MapDialog } from "./components/MapDialog";
import { Seasons } from "./routes/Seasons";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { RandomMapButton } from "./components/RandomMapButton";
import { Weekly } from "./routes/Weekly";
import { experimental_createQueryPersister } from "@tanstack/query-persist-client-core";
import { Clubs } from "./routes/Clubs";
import { Club } from "./routes/Club";

const Root = (props: ParentProps) => {
	return (
		<div class="h-screen flex">
			<Aside />
			<div class="flex flex-col flex-1 overflow-auto">
				<nav class="navbar bg-base-,300 ashadow-sm">
					<RandomMapButton />
				</nav>
				<main class="flex flex-col overflow-auto flex-1">{props.children}</main>
			</div>

			<MapDialog />
		</div>
	);
};

export const App = () => {
	const persister = experimental_createQueryPersister({
		storage: localStorage,
	});

	const queryClient = new QueryClient({
		defaultOptions: { queries: { persister: persister.persisterFn } },
	});

	return (
		<QueryClientProvider client={queryClient}>
			<Router root={Root}>
				<Route path="/" component={TOTD} />
				<Route path="/seasons" component={Seasons} />
				<Route path="/weekly-shorts" component={Weekly} />
				<Route path="/clubs" component={Clubs} />
				<Route path="/clubs/:clubId/:id" component={Club} />
			</Router>
		</QueryClientProvider>
	);
};
