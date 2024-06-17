import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_CATEGORY } from "@mutations";
import { useRouter } from "next/router";
import { Grid, TextField, Button, Paper, Typography } from "@mui/material";
import AdminLayout from "../../../components/AdminLayout";
import { toast } from "react-toastify";
import { useRefetch } from "../../../context/RefetchContext";
import "react-toastify/dist/ReactToastify.css";

interface CategoryInput {
	name: string;
	pois?: string[];
}

const NewCategory: React.FC = () => {
	const router = useRouter();
	const { refetchCategories } = useRefetch();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CategoryInput>();
	const [createCategory, { error }] = useMutation(CREATE_NEW_CATEGORY);

	const onSubmit: SubmitHandler<CategoryInput> = async (formData) => {
		try {
			await createCategory({
				variables: {
					categoryData: {
						name: formData.name,
						pois: formData.pois ? formData.pois : [],
					},
				},
			});
			reset();
			refetchCategories();
			router.push("/admin/categories/categories");
			toast.success("Catégorie créée avec succès !");
		} catch (error) {
			console.error("Error creating new category:", error);
			toast.error(
				"Erreur lors de la création de la catégorie. Veuillez réessayer."
			);
		}
	};

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
							Créer une nouvelle catégorie
						</Typography>

						<TextField
							fullWidth
							placeholder="Nom de la catégorie"
							variant="standard"
							style={{ marginBottom: "1rem" }}
							{...register("name", { required: true })}
							helperText={errors.name && "Ce champ est requis"}
						/>

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
							Créer Catégorie
						</Button>

						{error && (
							<Typography color="error" align="center">
								Erreur lors de la création de la catégorie. Veuillez réessayer.
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

export default NewCategory;
