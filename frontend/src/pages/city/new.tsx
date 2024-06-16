import { Typography, Button, TextField, Paper, Box, Grid } from "@mui/material";
import { mainTheme } from "@theme";
import React from "react";
import { CREATE_NEW_CITY } from "@mutations";
import { useMutation } from "@apollo/client";
import { CityInput } from "@types";
import { toast } from "react-toastify";
import { useAuth } from "context";
import { useRouter } from "next/navigation";

const defaultState: CityInput = {
	name: "",
	description: "",
};

//TODO : input validation
const NewCity = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const [form, setForm] = React.useState<CityInput>(defaultState);

	const [createNewCity, { data, loading, error }] =
		useMutation(CREATE_NEW_CITY);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createNewCity({
			variables: {
				cityData: {
					name: form.name.charAt(0).toUpperCase() + form.name.slice(1),
					description: form.description,
				},
			},
		})
			.then((res: any) => {
				console.log("res", res);
				toast.success(`La ville ${form.name} a été crée`);
				router.push(`/city/list`);
			})
			.catch(() => {
				toast.error("Une erreur est survenue lors de la création de la ville");
			});
	};

	const isDisabled = React.useMemo(() => {
		return !(form.name && form.description);
	}, [form]);

	React.useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated]);

	return isAuthenticated ? (
		<Paper
			component={Box}
			elevation={5}
			square={false}
			width={{ xs: "85%", lg: "60%" }}
			height={window.innerHeight * 0.7}
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<Grid container flex={1}>
				<Grid
					item
					flex={1}
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					<Box
						component="form"
						onSubmit={(e) => onSubmit(e)}
						flex={1}
						display="flex"
						flexDirection="column"
						justifyContent="space-evenly"
						alignItems="center"
						height="100%"
						padding={5}
						gap={6}
					>
						<Typography
							fontFamily={mainTheme.typography.fontFamily}
							fontSize={{
								sx: mainTheme.typography.h6.fontSize,
								sm: mainTheme.typography.h5.fontSize,
								md: mainTheme.typography.h4.fontSize,
								lg: mainTheme.typography.h3.fontSize,
							}}
							color={mainTheme.palette.primary.main}
							fontWeight={mainTheme.typography.fontWeightMedium}
						>
							Création d&apos;une nouvelle ville
						</Typography>
						<TextField
							data-testid="input_name"
							id="name"
							variant="standard"
							placeholder="Nom de la ville"
							required
							size="medium"
							fullWidth
							margin="normal"
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
						<TextField
							data-testid="input_description"
							id="description"
							variant="standard"
							placeholder="Description"
							multiline
							rows={5}
							required
							size="medium"
							fullWidth
							margin="normal"
							onChange={(e) =>
								setForm({ ...form, description: e.target.value })
							}
						/>
						<Button
							disabled={isDisabled}
							type="submit"
							variant="contained"
							color="primary"
						>
							Créer
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Paper>
	) : (
		<Typography>Vous devez être connecté pour accéder à cette page.</Typography>
	);
};

export default NewCity;
