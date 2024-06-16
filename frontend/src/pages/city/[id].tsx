import { useQuery } from "@apollo/client";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { GET_CITY_BY_ID } from "@queries";
import { mainTheme } from "@theme";
import { useAuth } from "context";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";

const DisplayCityByID = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const { id } = router.query;
	console.log(id, typeof id, Number(id));
	const { data, error, loading } = useQuery(GET_CITY_BY_ID, {
		variables: { getCityByIdId: Number(id) },
	});

	React.useEffect(() => {
		if (error) {
			toast.error("Erreur lors de la récupération des données de la ville.");
		}
	}, [error]);

	React.useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated]);

	return isAuthenticated ? (
		<>
			{loading ? (
				<CircularProgress color="primary" />
			) : (
				<>
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
								{data?.getCityById ? (
									<Box>
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
											alignContent="center"
										>
											Ville : {data?.getCityById?.name}
										</Typography>
										<Typography>
											Description : {data?.getCityById?.description}
										</Typography>
										<Typography>Latitude : {data?.getCityById?.lat}</Typography>
										<Typography>
											Longitude : {data?.getCityById?.lon}
										</Typography>
										{/* <Typography>
											Point d&as;intérêt :{" "}
											{data?.getCityById?.pois !== null ? (
												<>
													{data?.getCityById?.pois.map((poi) => {
														return (
															<Box>
																<Typography>{poi?.name}</Typography>
															</Box>
														);
													})}
												</>
											) : (
												<>
													<Typography>
														Aucun point d&apos;intrêt pour l&apos;instant
													</Typography>
												</>
											)}
										</Typography> */}
									</Box>
								) : (
									<></>
								)}
							</Grid>
						</Grid>
					</Paper>
				</>
			)}
		</>
	) : (
		<Typography>
			Vous devez être connecté et avoir les droits pour accéder à cette page.
		</Typography>
	);
};

export default DisplayCityByID;
