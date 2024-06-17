import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import "mapbox-gl/dist/mapbox-gl.css";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Layout } from "@components";
import "../styles/globals.css";
import { UserProvider } from "../context/UserContext";
import { RefetchProvider } from "../context/RefetchContext";
import useWindowDimensions from "../utils/windowDimensions";

const backend_url =
	process.env.NODE_ENV === "development"
		? "http://localhost:4000/api/graphql"
		: "/graphql";

const httpLink = createHttpLink({
	uri: backend_url,
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("jwt");
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
	const { height, width } = useWindowDimensions();
	return (
		<ApolloProvider client={client}>
			<UserProvider>
				<RefetchProvider>
					<Layout>
						<Component style={{ height: height - 120 }} {...pageProps} />
					</Layout>
				</RefetchProvider>
				<ToastContainer />
			</UserProvider>
		</ApolloProvider>
	);
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
