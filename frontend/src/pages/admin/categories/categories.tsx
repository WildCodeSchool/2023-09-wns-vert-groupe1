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
	Modal,
} from "@mui/material";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import AdminLayout from "../../../components/AdminLayout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { GET_ALL_CATEGORIES } from "@queries";
import { DELETE_CATEGORY } from "@mutations";
import { toast } from "react-toastify";
import { useRefetch } from "../../../context/RefetchContext";
import "react-toastify/dist/ReactToastify.css";

const PageCategorie = () => {
	const router = useRouter();
	const { refetchCategories, setRefetchCategories } = useRefetch();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(4);
	const [loadingData, setLoadingData] = useState(true);
	const [openModal, setOpenModal] = useState(false);
	const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

	const { loading, error, data, refetch } = useQuery(GET_ALL_CATEGORIES);
	const [deleteCategory] = useMutation(DELETE_CATEGORY, {
		onCompleted: () => {
			toast.success("Category deleted successfully!");
			refetch();
			closeDeleteModal();
		},
		onError: (error) => {
			toast.error(`Error deleting category: ${error.message}`);
		},
	});

	useEffect(() => {
		setRefetchCategories(() => refetch);
	}, [refetch, setRefetchCategories]);

	useEffect(() => {
		setLoadingData(loading);
	}, [loading]);

	useEffect(() => {
		if (error) {
			console.error("Error fetching categories:", error.message);
			toast.error(`Erreur: ${error.message}`);
		}
	}, [error]);

	const handleCreateCategory = () => {
		router.push("/admin/categories/new");
	};

	const openDeleteModal = (categoryId: any) => {
		setCategoryIdToDelete(categoryId);
		setOpenModal(true);
	};

	const closeDeleteModal = () => {
		setCategoryIdToDelete(null);
		setOpenModal(false);
	};

	const confirmDeleteCategory = () => {
		deleteCategory({ variables: { id: categoryIdToDelete } });
	};

	const handleChangePage = (event: any, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
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

	if (!data || !data.getAllCategories || data.getAllCategories.length === 0) {
		return (
			<AdminLayout>
				<Typography variant="h1">Liste des catégories</Typography>
				<p>Pas de catégorie</p>
				<Button
					variant="contained"
					color="primary"
					onClick={handleCreateCategory}
				>
					Créer une nouvelle catégorie
				</Button>
			</AdminLayout>
		);
	}

	const paginatedCategories = data.getAllCategories.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<AdminLayout>
			<Typography variant="h1">Liste des catégories</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Nom</TableCell>
						<TableCell>Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{paginatedCategories.map((category: { id: number; name: string }) => (
						<TableRow key={category.id}>
							<TableCell>{category.name}</TableCell>
							<TableCell>
								<Button
									variant="contained"
									color="error"
									onClick={() => openDeleteModal(category.id)}
									startIcon={<DeleteOutlineIcon />}
									style={{ margin: "0.5rem" }}
								>
									Supprimer
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[4, 8, 12]}
				component="div"
				count={data.getAllCategories.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				labelRowsPerPage="Lignes par page"
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={handleCreateCategory}
				style={{ marginTop: "1rem" }}
			>
				Créer une nouvelle catégorie
			</Button>
			<Modal
				open={openModal}
				onClose={closeDeleteModal}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						backgroundColor: "#fff",
						padding: "2rem",
						border: "2px solid #000",
						borderRadius: "8px",
					}}
				>
					<Typography variant="h6" id="modal-title">
						Confirmation de suppression
					</Typography>
					<Typography variant="body1" id="modal-description">
						Êtes-vous sûr de vouloir supprimer cette catégorie ?
					</Typography>
					<Button
						variant="contained"
						color="primary"
						onClick={confirmDeleteCategory}
						style={{ marginTop: "1rem" }}
					>
						Confirmer la suppression
					</Button>
					<Button
						variant="contained"
						onClick={closeDeleteModal}
						style={{ marginLeft: "1rem", marginTop: "1rem" }}
					>
						Annuler
					</Button>
				</div>
			</Modal>
		</AdminLayout>
	);
};

export default PageCategorie;
