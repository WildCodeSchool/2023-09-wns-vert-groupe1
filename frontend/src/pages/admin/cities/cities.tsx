import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TablePagination,
	Button,
	CircularProgress,
	Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import AdminLayout from "../../../components/AdminLayout";
import { GET_ALL_CITIES } from "@queries";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PageCities = () => {
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(4);
	const [loadingData, setLoadingData] = useState(true);

	const { loading, error, data } = useQuery(GET_ALL_CITIES);

	useEffect(() => {
		setLoadingData(loading);
	}, [loading]);

	useEffect(() => {
		if (error) {
			console.error("Error fetching categories:", error.message);
			toast.error(`Erreur: ${error.message}`);
		}
	}, [error]);

	const handleCreateNewCity = () => {
		router.push("/city/new");
	};

	const handleChangePage = (
		event: any,
		newPage: React.SetStateAction<number>
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	if (loadingData) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "200px",
				}}
			>
				<CircularProgress />
			</div>
		);
	}

	if (!data || !data.getAllCities || data.getAllCities.length === 0) {
		return (
			<AdminLayout>
				<Typography variant="h1">Liste des villes</Typography>
				<p>Pas de villes</p>
				<Button
					variant="contained"
					color="primary"
					onClick={handleCreateNewCity}
				>
					Créer une nouvelle ville
				</Button>
			</AdminLayout>
		);
	}

	const paginatedCities = data.getAllCities.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<AdminLayout>
			<Typography variant="h1">Liste des villes</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Nom</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{paginatedCities.map((city: any) => (
						<TableRow key={city.id}>
							<TableCell>{city.name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[4, 8, 12]}
				component="div"
				count={data.getAllCities.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Lignes par page"
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={handleCreateNewCity}
				style={{ marginTop: "1rem" }}
			>
				Créer une nouvelle ville
			</Button>
		</AdminLayout>
	);
};

export default PageCities;
