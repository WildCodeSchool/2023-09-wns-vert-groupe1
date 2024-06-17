import React, { useState, useEffect } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import { DELETE_USER } from "@mutations";
import { GET_ALL_USERS } from "@queries";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRefetch } from "../../../context/RefetchContext";

const UsersAdminPage = () => {
	const router = useRouter();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(4);
	const [loadingData, setLoadingData] = useState(true);
	const [openModal, setOpenModal] = useState(false);
	const [userIdToDelete, setUserIdToDelete] = useState(null);

	const { refetchUsers } = useRefetch();

	const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);

	const [deleteUser] = useMutation(DELETE_USER, {
		refetchQueries: [{ query: GET_ALL_USERS }],
	});

	useEffect(() => {
		setLoadingData(loading);
	}, [loading]);

	useEffect(() => {
		if (error) {
			console.error("Error fetching users:", error.message);
			toast.error(`Erreur: ${error.message}`);
		}
	}, [error]);

	const handleCreateNewUser = () => {
		router.push("/admin/users/new");
	};

	const handleEditUser = (userId: any) => {
		router.push(`/admin/users/${userId}`);
	};

	const openDeleteModal = (userId: React.SetStateAction<null>) => {
		setUserIdToDelete(userId);
		setOpenModal(true);
	};

	const closeDeleteModal = () => {
		setUserIdToDelete(null);
		setOpenModal(false);
	};

	const confirmDeleteUser = (userId: null) => {
		deleteUser({ variables: { userId: String(userId) } })
			.then(() => {
				toast.success("Utilisateur supprimé avec succès !");
				refetchUsers();
			})
			.catch((error) => {
				console.error(
					"Erreur lors de la suppression de l'utilisateur :",
					error
				);
				toast.error("Erreur lors de la suppression de l'utilisateur.");
			});

		closeDeleteModal();
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

	if (!data || !data.getAllUsers) {
		return <p>Aucun utilisateur trouvé.</p>;
	}

	const paginatedUsers = data.getAllUsers.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	return (
		<AdminLayout>
			<div>
				<Typography variant="h1">Liste des utilisateurs</Typography>
				<br />
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Prénom</TableCell>
							<TableCell>Nom</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Rôle</TableCell>
							<TableCell>Ville</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedUsers.map((user: any) => (
							<TableRow key={user.id}>
								<TableCell>{user.firstName}</TableCell>
								<TableCell>{user.lastName}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.role}</TableCell>
								<TableCell>
									{user.city ? user.city.name : "Non spécifié"}
								</TableCell>
								<TableCell>
									<Button
										variant="contained"
										color="error"
										onClick={() => openDeleteModal(user.id)}
										startIcon={<DeleteOutlineIcon />}
										style={{ margin: "0.5rem" }}
									>
										Supprimer
									</Button>
									<Button
										variant="contained"
										color="primary"
										onClick={() => handleEditUser(user.id)}
										startIcon={<EditIcon />}
										style={{
											margin: "0.5rem",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										Modifier
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					rowsPerPageOptions={[4, 8, 12]}
					component="div"
					count={data.getAllUsers.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelRowsPerPage="Lignes par page"
				/>
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
							Êtes-vous sûr de vouloir supprimer cet utilisateur ?
						</Typography>
						<Button
							variant="contained"
							color="primary"
							onClick={() => confirmDeleteUser(userIdToDelete)}
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
			</div>
			<Button variant="contained" onClick={handleCreateNewUser}>
				Créer un nouvel utilisateur
			</Button>
		</AdminLayout>
	);
};

export default UsersAdminPage;
