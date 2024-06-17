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
import { GET_ALL_POIS } from "@queries";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PagePois = () => {
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(4);
	const [loadingData, setLoadingData] = useState(true);

	const { loading, error, data } = useQuery(GET_ALL_POIS);

	useEffect(() => {
		setLoadingData(loading);
	}, [loading]);

	useEffect(() => {
		if (error) {
			console.error("Error fetching pois:", error.message);
			toast.error(`Erreur: ${error.message}`);
		}
	}, [error]);

	const handleCreateNewPoi = () => {
		router.push("/poi/new");
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

	if (!data || !data.getAllPois || data.getAllPois.length === 0) {
		return (
			<AdminLayout>
				<Typography variant="h1">Liste des points d'intérêt</Typography>
				<p>Pas de point d'intérêts</p>
				<Button
					variant="contained"
					color="primary"
					onClick={handleCreateNewPoi}
				>
					Créer un nouveau point d'intérêts
				</Button>
			</AdminLayout>
		);
	}

	const paginatedPois = data.getAllPois.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<AdminLayout>
			<Typography variant="h1">Liste des points d'interets</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Nom</TableCell>
						<TableCell>Adresse</TableCell>
						<TableCell>Code Postal</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Images</TableCell>
						<TableCell>Categorie</TableCell>
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{paginatedPois.map((poi: any) => (
						<TableRow key={poi.id}>
							<TableCell>{poi.name}</TableCell>
							<TableCell>{poi.address}</TableCell>
							<TableCell>{poi.postalCode}</TableCell>
							<TableCell>{poi.description}</TableCell>
							<TableCell>
								{poi.images.map((image: string, index: number) => (
									<img
										key={index}
										src={image}
										alt={poi.name}
										style={{
											width: "50px",
											height: "50px",
											marginRight: "5px",
										}}
									/>
								))}
							</TableCell>
							<TableCell>{poi.category.name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[4, 8, 12]}
				component="div"
				count={data.getAllPois.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Lignes par page"
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={handleCreateNewPoi}
				style={{ marginTop: "1rem" }}
			>
				Créer un nouveau point d'interets
			</Button>
		</AdminLayout>
	);
};

export default PagePois;
