import { useState } from "react";
import { useRouter } from "next/router";
import { Paper } from "@mui/material";
import { mainTheme } from "@theme";
import { SearchInput } from "./SearchInput";
import { SearchButton } from "./SearchButton";
import { toast } from "react-toastify";

export const SearchForm = () => {
	const router = useRouter();
	const [error, setError] = useState(false);
	const [city, setCity] = useState("");
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === "city") {
			setCity(e.target.value);
		}
		setError(false);
	};
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (city.trim() === "") {
			setError(true);
			toast.error("Veuillez saisir un nom de ville.");
			console.log("error", error);
		} else {
			setError(false);
			setCity(city);
			router.push(`/city/search/${city}`);
		}
	};
	return (
		<Paper
			component="form"
			onSubmit={handleSubmit}
			data-testid="search-form-container"
			sx={{
				padding: `${mainTheme.spacing(3)} ${mainTheme.spacing(3)} ${mainTheme.spacing(3)} ${mainTheme.spacing(7)}`,
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-around",
				borderRadius: "45px",
				boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.15)",
			}}
		>
			<SearchInput
				name="city"
				value={city}
				onChange={handleChange}
				placeholder="Cherchez une ville"
				error={error}
			/>
			<SearchButton />
		</Paper>
	);
};
