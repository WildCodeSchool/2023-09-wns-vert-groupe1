import { useLazyQuery } from "@apollo/client";
import { CHECK_INFO, GET_USER, LOGIN } from "../graphql/queries/queries";
import { LoginT, UserType } from "@types";
import { useRouter } from "next/router";
import React from "react";
import { PropsWithChildren } from "react";
import { toast } from "react-toastify";

interface Store {
	user: UserType | undefined;
	error?: string;
	isAuthenticated: boolean;
	jwt: string | undefined;
	onLogout: () => void;
	onLogin: (payload: LoginT) => void;
	setUser: (user: UserType) => void;
	setError: (error?: string) => void;
}

const defaultStore: Store = {
	user: undefined,
	error: undefined,
	isAuthenticated: false,
	jwt: undefined,
	setUser: () => {},
	onLogin: () => {},
	setError: () => {},
	onLogout: () => {},
};

const errors = {
	getUser: "Une erreur est survenue lors de la récupération de votre compte",
	login: "Une erreur est survenue lors de votre connexion, ressayer à nouveau.",
	register: "Une erreur est survenue lors de votre inscription.",
	adminRole: "Vous devez être administrateur pour accéder à cette page",
	cityAdminRole:
		"Vous devez être administrateur ou administrateur de ville pour accéder à cette page",
	superUserRole: "Vous devez être super user pour accéder à cette page",
};

const UserContext = React.createContext(defaultStore);

const useAuth = () => React.useContext(UserContext);

function UserProvider({ children }: PropsWithChildren) {
	const router = useRouter();
	const [user, setUser] = React.useState(defaultStore["user"]);
	const [error, setError] = React.useState(defaultStore["error"]);
	const [checkSession] = useLazyQuery(CHECK_INFO);
	const [jwt, setJwt] = React.useState(defaultStore["jwt"]);
	const [login] = useLazyQuery(LOGIN);
	const [getUser] = useLazyQuery(GET_USER);

	const onLogin = React.useCallback(
		async (payload: LoginT) => {
			await login({
				variables: {
					userData: { email: payload.email, password: payload.password },
				},
			})
				.then((res) => {
					const data = JSON.parse(res.data.login);
					getUser({ variables: { getUserByIdId: data.id } })
						.then((res) => {
							setJwt(data.token);
							localStorage.setItem("jwt", data.token);
							setUser(res?.data?.getUserById);
							localStorage.setItem(
								"user",
								JSON.stringify(res?.data?.getUserById)
							);
						})
						.catch(() => {
							setError(errors.getUser);
							toast.error(errors.getUser);
						});
				})
				.catch(() => {
					setError(errors.login);
					toast.error(errors.login);
				});
		},
		[getUser, login]
	);

	const onLogout = React.useCallback(() => {
		router.push("/");
		localStorage.removeItem("jwt");
		localStorage.removeItem("user");
		setUser(undefined);
		setJwt(undefined);
	}, []);

	React.useEffect(() => {
		if (window) {
			if (jwt) {
				window.localStorage.setItem("jwt", jwt);
			}
			if (user) {
				window.localStorage.setItem("user", JSON.stringify(user));
			}
		}
	}, [jwt, user]);

	React.useEffect(() => {
		async function restore() {
			await checkSession()
				.then((res) => {
					if (!res?.data?.checkSession) {
						onLogout();
					}
				})
				.catch(() => {
					onLogout();
					toast.error("Une erreur est survenue");
				});
			const storedToken = window.localStorage.getItem("jwt");
			const storedUser = window.localStorage.getItem("user");
			setJwt(storedToken ? storedToken : defaultStore["jwt"]);
			setUser(storedUser ? JSON.parse(storedUser) : defaultStore["user"]);
		}

		restore();
	}, [checkSession, onLogout]);

	const isAuthenticated = !!user && !!jwt;

	const initialState: any = React.useMemo(
		() => ({
			user,
			jwt,
			error,
			onLogin,
			setUser,
			setError,
			onLogout,
			isAuthenticated,
		}),
		[user, jwt, error, onLogin, setUser, setError, onLogout, isAuthenticated]
	);
	return (
		<UserContext.Provider value={initialState}>{children}</UserContext.Provider>
	);
}

export { UserProvider, useAuth };
