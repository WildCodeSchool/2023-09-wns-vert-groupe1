import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { styled } from "@mui/material/styles";
import {
	Paper,
	TextField,
	Select,
	MenuItem,
	Button,
	Grid,
	InputLabel,
	Typography,
	FormControl,
} from "@mui/material";
import { mainTheme } from "@theme";
import { CREATE_NEW_POI } from "@mutations";
import { GET_ALL_CITIES, GET_ALL_CATEGORIES } from "@queries";
import { POIInput } from "@types";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ImagesCarousel } from "@components";

const NewPoi = () => {
	const [imageURLs, setImageURLs] = useState<string[]>([]);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<POIInput>({ mode: "onBlur" });
	const { data: cityData } = useQuery<{
		getAllCities: {
			id: number;
			name: string;
		}[];
	}>(GET_ALL_CITIES);

	const { data: categoryData } = useQuery<{
		getAllCategories: {
			id: number;
			name: string;
		}[];
	}>(GET_ALL_CATEGORIES);

	const [createNewPoi] = useMutation(CREATE_NEW_POI);

	const onSubmit: SubmitHandler<POIInput> = async (formData: POIInput) => {
		try {
			const result = await createNewPoi({
				variables: {
					poiData: {
						name: formData.name,
						address: formData.address,
						postalCode: formData.postalCode,
						description: formData.description,
						images: imageURLs.map((image) => "http://localhost:8000" + image),
						city: Number.parseInt(formData.city),
						category: Number.parseInt(formData.category),
					},
				},
			});
			console.log(result);
			setImageURLs([]);
			reset();
			router.push(`/poi/${result.data.createNewPoi.id}`);
		} catch (err: any) {
			toast.error(
				"Une erreur est survenue lors de la soumission du formulaire."
			);
			console.error(err);
		}
	};

	const VisuallyHiddenInput = styled("input")({
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		height: 1,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		left: 0,
		whiteSpace: "nowrap",
		width: 1,
	});
	console.log(imageURLs);
	// TODO : add form control and make all fields mandatory, fix console errors
	if (cityData && categoryData) {
		return (
			<Grid
				container
				justifyContent="space-evenly"
				alignItems="center"
				style={{ maxHeight: "75vh" }}
			>
				<Grid item xs={6}>
					{imageURLs.length > 0 ? (
						<Paper
							sx={{
								padding: mainTheme.spacing(3),
								borderRadius: mainTheme.spacing(2),
								boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.15)",
								marginTop: "1rem",
								height: "70vh",
							}}
						>
							<ImagesCarousel
								images={imageURLs.map(
									(image) => `http://localhost:8000${image}`
								)}
							/>
						</Paper>
					) : (
						<Paper
							sx={{
								padding: mainTheme.spacing(3),
								borderRadius: mainTheme.spacing(2),
								boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.15)",
								marginTop: "1rem",
								height: "70vh",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<AddPhotoAlternateOutlinedIcon
								sx={{
									color: mainTheme.palette.primary.main,
									fontSize: "100px",
								}}
							/>
						</Paper>
					)}
				</Grid>
				<Grid item xs={12} sm={5}>
					<Paper
						component="form"
						onSubmit={handleSubmit(onSubmit)}
						sx={{
							padding: mainTheme.spacing(3),
							borderRadius: mainTheme.spacing(2),
							boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.15)",
							marginTop: "1rem",
							height: "70vh",
						}}
					>
						<Typography
							color={mainTheme.palette.primary.main}
							align="center"
							sx={{ fontSize: mainTheme.typography.h4, fontWeight: "bold" }}
						>
							Ajouter un point d'intérêt
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									label="Nom"
									{...register("name", {
										required: {
											value: true,
											message: "Ce champ est obligatoire",
										},
									})}
									variant="standard"
									fullWidth
									margin="normal"
									size="small"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Adresse"
									{...register("address", {
										required: {
											value: true,
											message: "Ce champ est obligatoire",
										},
									})}
									variant="standard"
									fullWidth
									margin="normal"
									size="small"
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									label="Code Postal"
									{...register("postalCode", {
										required: {
											value: true,
											message: "Ce champ est obligatoire",
										},
									})}
									variant="standard"
									fullWidth
									margin="normal"
									size="small"
								/>
							</Grid>
							<Grid item xs={4}>
								<FormControl fullWidth margin="normal" size="small">
									<InputLabel id="city">Ville</InputLabel>
									<Select
										label="Ville"
										labelId="city"
										{...register("city", {
											required: {
												value: true,
												message: "Ce champ est obligatoire",
											},
										})}
										fullWidth
										color="primary"
									>
										{cityData?.getAllCities?.map((city) => (
											<MenuItem key={city.id} value={city.id}>
												{city.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={4}>
								<FormControl fullWidth margin="normal" size="small">
									<InputLabel id="category">Catégorie</InputLabel>
									<Select
										label="Catégorie"
										labelId="category"
										{...register("category", {
											required: {
												value: true,
												message: "Ce champ est obligatoire",
											},
										})}
										fullWidth
										color="primary"
									>
										{categoryData?.getAllCategories?.map((category) => (
											<MenuItem key={category.id} value={category.id}>
												{category.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<TextField
									label="Description"
									multiline
									rows={3}
									{...register("description", {
										required: {
											value: true,
											message: "Ce champ est obligatoire",
										},
									})}
									fullWidth
									variant="standard"
									margin="normal"
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									marginTop: "1rem",
								}}
							>
								<Button
									component="label"
									color="primary"
									role={undefined}
									variant="contained"
									tabIndex={-1}
									startIcon={<AddPhotoAlternateOutlinedIcon />}
								>
									Ajouter des images
									<VisuallyHiddenInput
										type="file"
										onChange={async (e: any) => {
											if (e.target.files) {
												const selectedFiles = Array.from(e.target.files);
												const url = "http://localhost:8000/upload";
												const uploadPromises = (selectedFiles as File[]).map(
													async (file: File) => {
														const formData = new FormData();
														formData.append("file", file, file.name);
														try {
															const response = await axios.post(url, formData);
															console.log(response);
															return response.data.filename;
														} catch (err) {
															console.log("error", err);
															return null;
														}
													}
												);

												Promise.all(uploadPromises).then((filenames) => {
													setImageURLs((prevImageURLs) => [
														...prevImageURLs,
														...filenames.filter(
															(filename) => filename !== null
														),
													]);
												});
											}
										}}
										multiple
									/>
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
								sx={{
									display: "flex",
									justifyContent: "right",
									marginTop: "1rem",
								}}
							>
								<Button type="submit" variant="contained" color="primary">
									Valider
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</Grid>
		);
	}
};

export default NewPoi;
