import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@apollo/client";
import { REGISTER } from "@mutations";
import { GET_ALL_CITIES } from "@queries";
import { CityType, UserInput } from "@types";
import { useRouter } from "next/router";
import {
	Grid,
	TextField,
	Button,
	Paper,
	Typography,
	Select,
	InputLabel,
	MenuItem,
} from "@mui/material";
import AdminLayout from "../../../components/AdminLayout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRefetch } from "../../../context/RefetchContext";

const NewUser: React.FC = () => {
	const router = useRouter();

	const { data } = useQuery(GET_ALL_CITIES);
	const {
		register: registerForm,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UserInput>();

	const [cities, setCities] = useState<CityType[]>([]);

	const { refetchUsers } = useRefetch();

	const [registerUser, { error }] = useMutation(REGISTER, {
		onCompleted: () => {
			refetchUsers();
			router.push("/admin/users/users");
			toast.success("Utilisateur créé avec succès !");
		},
		onError: (error) => {
			console.error("Error creating new user:", error);
			toast.error(
				"Erreur lors de la création de l'utilisateur. Veuillez réessayer."
			);
		},
	});

	const onSubmit: SubmitHandler<UserInput> = async (formData) => {
		try {
			await registerUser({
				variables: {
					newUserData: {
						firstName: formData.firstName,
						lastName: formData.lastName,
						email: formData.email,
						password: formData.password,
						city: formData.city,
					},
				},
			});
			reset();
		} catch (error) {
			console.error("Error creating new user:", error);
			toast.error(
				"Erreur lors de la création de l'utilisateur. Veuillez réessayer."
			);
		}
	};

	useEffect(() => {
		if (data) {
			setCities(data.getAllCities);
		}
	}, [data]);

	return (
		<AdminLayout>
			<Grid container justifyContent="center">
				<Grid item xs={12} sm={8} md={6}>
					<Paper
						variant="elevation"
						elevation={3}
						style={{ paddingLeft: "6rem", paddingRight: "6rem" }}
						component="form"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Typography
							variant="h3"
							color="primary"
							align="center"
							gutterBottom
							fontWeight="bold"
							style={{
								marginBottom: "2rem",
								paddingTop: "2rem",
								marginTop: "4rem",
							}}
						>
							Créer un nouvel utilisateur
						</Typography>

						<TextField
							fullWidth
							placeholder="Prénom"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...registerForm("firstName", { required: true })}
							helperText={errors.firstName && "Ce champ est requis"}
						/>

						<TextField
							fullWidth
							placeholder="Nom"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...registerForm("lastName", { required: true })}
							helperText={errors.lastName && "Ce champ est requis"}
						/>

						<TextField
							fullWidth
							placeholder="E-mail"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...registerForm("email", {
								required: true,
								maxLength: 200,
							})}
							helperText={errors.email && "Ce champ est requis"}
						/>

						<TextField
							fullWidth
							placeholder="Mot de passe"
							variant="standard"
							type="password"
							style={{ marginBottom: "1rem" }}
							{...registerForm("password", { required: true })}
							helperText={errors.password && "Ce champ est requis"}
						/>

						<InputLabel id="city-label">Sélectionner une ville</InputLabel>
						<Select
							labelId="city-label"
							id="city"
							defaultValue=""
							sx={{ width: "100%" }}
							{...registerForm("city", { required: true })}
						>
							{cities.map((el) => (
								<MenuItem key={el.id} value={el.id}>
									{el.name}
								</MenuItem>
							))}
						</Select>

						<Button
							variant="contained"
							color="primary"
							type="submit"
							fullWidth
							style={{
								marginBottom: "2rem",
								marginTop: "1rem",
								borderRadius: "24px",
							}}
						>
							Créer Utilisateur
						</Button>

						{error && (
							<Typography color="error" align="center">
								Erreur lors de la création de l'utilisateur. Veuillez réessayer.
							</Typography>
						)}

						<Typography
							gutterBottom
							color="primary"
							variant="subtitle1"
							align="center"
							sx={{
								fontSize: "1rem",
								textAlign: "center",
								paddingBottom: "1rem",
							}}
						></Typography>
					</Paper>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default NewUser;
