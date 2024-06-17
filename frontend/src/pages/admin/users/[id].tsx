import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER } from "@queries";
import { UPDATE_USER } from "@mutations";
import AdminLayout from "../../../components/AdminLayout";
import { TextField, Button, Stack } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetailsPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const { loading, error, data } = useQuery(GET_USER, {
		variables: { getUserByIdId: Number(id) },
	});

	const [updateUser] = useMutation(UPDATE_USER);

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		role: "",
		city: 0,
	});

	useEffect(() => {
		if (data && data.getUserById) {
			const { firstName, lastName, email, role, city } = data.getUserById;
			setFormData({ firstName, lastName, email, role, city });
		}
	}, [data]);

	const handleChange = (e: { target: { name: any; value: any } }) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await updateUser({
				variables: {
					userId: Number(id),
					userData: { ...formData },
				},
			});
			toast.success("Utilisateur mis à jour avec succès !");
			router.push(`/admin`);
		} catch (error) {
			toast.error("Erreur lors de la mise à jour de l'utilisateur");
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!data || !data.getUserById) return <p>Utilisateur non trouvé.</p>;

	return (
		<AdminLayout>
			<Stack spacing={2}>
				<ToastContainer />
				<h1>Détails de l'utilisateur</h1>
				<form onSubmit={handleSubmit}>
					<TextField
						name="firstName"
						label="Prénom"
						variant="outlined"
						value={formData.firstName}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						name="lastName"
						label="Nom"
						variant="outlined"
						value={formData.lastName}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						name="email"
						label="Email"
						variant="outlined"
						value={formData.email}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						name="role"
						label="Rôle"
						variant="outlined"
						value={formData.role}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<TextField
						name="city"
						label="Ville"
						type="number"
						variant="outlined"
						value={formData.city}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<Button type="submit" variant="contained" color="primary">
						Enregistrer les modifications
					</Button>
				</form>
			</Stack>
		</AdminLayout>
	);
};

export default UserDetailsPage;
