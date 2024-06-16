import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { EDIT_CITY_BY_ID } from "@mutations";
import { GET_CITY_BY_ID } from "@queries";
import { mainTheme } from "@theme";
import { CityInput } from "@types";
import { useAuth } from "context";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";

const EditCityByID = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const { id } = router.query;

	const {
		data: cityData,
		error: cityError,
		loading: cityLoading,
	} = useQuery(GET_CITY_BY_ID, {
		variables: { getCityByIdId: Number(id) },
	});

	const [editCity, { data, error, loading }] = useMutation(EDIT_CITY_BY_ID);

	const [form, setForm] = React.useState<CityInput>({
		name: "",
		description: "",
	});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		editCity({
			variables: {
				cityData: {
					name: form.name.charAt(0).toUpperCase() + form.name.slice(1),
					description: form.description,
				},
				updateCityId: cityData?.getCityById?.id,
			},
		})
			.then((res: any) => {
				toast.success(`La ville ${form.name} a bien été modifié.`);
				router.push(`/city/${res?.data?.updateCity?.id}`);
			})
			.catch(() => {
				toast.error(
					"Une erreur est survenue lors de la modification de la ville"
				);
			});
	};

	const isDisabled = React.useMemo(() => {
		return !(form.name && form.description);
	}, [form]);

	React.useEffect(() => {
		if (error) {
			toast.error("Erreur lors de la modification des données de la ville.");
		}
		if (cityError) {
			toast.error("Erreur lors de la récupération des données de la ville.");
		}
		if (cityData?.getCityById) {
			setForm({
				name: cityData.getCityById.name,
				description: cityData.getCityById.description,
			});
		}
	}, [error, cityError, cityData]);

	React.useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated]);

	return (
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
							Modification de la ville {cityData?.name}
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
							value={form.name ?? form.name}
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
							value={form?.description ?? form.description}
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
							Enregistrer
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default EditCityByID;
