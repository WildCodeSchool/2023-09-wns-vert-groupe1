import { useMutation, useQuery } from "@apollo/client";
import {
	Box,
	Button,
	Grid,
	Modal,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from "@mui/material";
import { GET_ALL_CITIES } from "@queries";
import { mainTheme } from "@theme";
import { useAuth } from "context";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DELETE_CITY_BY_ID } from "@mutations";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { CityType } from "@types";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	p: 4,
};

const CityList = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	const [open, setOpen] = React.useState<boolean>(false);
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
	const [offset, setOffset] = React.useState<number>(0);
	const [limit, setLimit] = React.useState<number>(10);
	const [city, setCity] = React.useState<CityType>();

	const {
		data: citiesData,
		loading: citiesLoading,
		error: citiesError,
		refetch,
	} = useQuery(GET_ALL_CITIES, {
		variables: { offset, limit },
		notifyOnNetworkStatusChange: true,
		fetchPolicy: "cache-and-network",
	});

	const [
		deleteCity,
		{
			data: deleteCityData,
			loading: deleteCityLoading,
			error: deleteCityError,
		},
	] = useMutation(DELETE_CITY_BY_ID);

	React.useLayoutEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated]);

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		console.log("page", page, "newPage", newPage);
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		console.log("rowPerPage", rowsPerPage);
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	React.useEffect(() => {
		if (citiesError) {
			toast.error(
				"Une erreur est surveune lors de la récupération des données."
			);
		}

		if (deleteCityError) {
			toast.error(
				"Une erreur est surveune lors de la suppression de la ville."
			);
		}
	}, [citiesError, deleteCityError]);

	return (
		<Paper
			component={Box}
			elevation={5}
			square={false}
			width="80%"
			height={window.innerHeight * 0.7}
			mx="auto"
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Grid
				container
				width="100%"
				display="flex"
				flexDirection="column"
				alignContent="flex-start"
				gap={mainTheme.spacing(6)}
			>
				<Grid
					item
					width="100%"
					display="flex"
					sx={{
						backgroundColor: mainTheme.palette.primary.light,
					}}
				>
					<Box
						flex={1}
						display="flex"
						alignContent="center"
						flexDirection="row"
						justifyContent="space-between"
						padding={mainTheme.spacing(6)}
						// sx={{ backgroundColor: "black" }}
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
							alignContent="center"
						>
							Listes des villes :
						</Typography>
						<AddCircleIcon
							onClick={() => router.push("/city/new")}
							sx={{
								color: mainTheme.palette.primary.main,
								fontSize: "50px",
								cursor: "pointer",
							}}
						/>
					</Box>
				</Grid>
				<Grid item width="95%" mx="auto">
					<TableContainer component={Paper}>
						<Table
							sx={{
								minWidth: 650,
								border: `2px solid ${mainTheme.palette.primary.main}`,
								borderRadius: "20rem",
								"& .MuiTableHead-root": {
									backgroundColor: ` ${mainTheme.palette.primary.light}`,
								},
							}}
							aria-label="simple table"
						>
							<TableHead>
								<TableRow>
									<TableCell align="center">Nom</TableCell>
									<TableCell align="center">Description</TableCell>
									<TableCell align="center">Latitude</TableCell>
									<TableCell align="center">Longitude</TableCell>
									<TableCell align="center">Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{citiesData?.getAllCities?.map((city: CityType) => (
									<TableRow
										key={city.name}
										sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
									>
										<TableCell align="center">{city.name}</TableCell>
										<TableCell
											sx={{
												maxWidth: 300,
												whiteSpace: "nowrap",
												overflow: "hidden",
												textOverflow: "ellipsis",
											}}
											align="center"
										>
											{city?.description}
										</TableCell>
										<TableCell align="center">{city?.lat}</TableCell>
										<TableCell align="center">{city?.lon}</TableCell>

										<TableCell align="center">
											<Box
												display="flex"
												flexDirection="row"
												justifyContent="space-evenly"
												alignContent="center"
												gap={mainTheme.spacing(2)}
											>
												<RemoveRedEyeIcon
													sx={{
														color: mainTheme.palette.primary.main,
														fontSize: "25px",
														cursor: "pointer",
													}}
													onClick={() =>
														router.push(`/city/search/${city.name}`)
													}
													// onClick={() => {
													// 	router.push(`/city/${city.id}`);
													// }}
												/>
												<EditIcon
													sx={{
														color: mainTheme.palette.primary.main,
														fontSize: "25px",
														cursor: "pointer",
													}}
													onClick={() => router.push(`/city/edit/${city.id}`)}
												/>
												<DeleteIcon
													sx={{
														color: mainTheme.palette.primary.main,
														fontSize: "25px",
														cursor: "pointer",
													}}
													onClick={() => {
														setOpen(true);
														setCity(city);
													}}
												/>
											</Box>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						component="div"
						count={100}
						page={page}
						onPageChange={handleChangePage}
						rowsPerPage={rowsPerPage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
					<Modal
						key={city?.id}
						open={open}
						onClose={() => setOpen(false)}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
						// BackdropProps={{
						// 	style: {
						// 		backgroundColor: "rgba(0, 0, 0, 0.1)",
						// 	},
						// }}
					>
						<Box sx={style}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								{`Voulez vous vraiment supprimer ${city?.name} ?`}
							</Typography>
							<Button
								onClick={() => {
									deleteCity({
										variables: { deleteCityByIdId: city?.id },
									}).then((res) => {
										refetch();
										setOpen(false);
										toast.success(
											`La ville ${city?.name} a bien été supprimé !`
										);
									});
								}}
							>
								Confirmer
							</Button>
							<Button
								sx={{ color: mainTheme.palette.error.main }}
								onClick={() => setOpen(false)}
							>
								Annuler
							</Button>
						</Box>
					</Modal>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default CityList;
