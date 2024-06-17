import React from "react";
import { useAuth } from "context/UserContext";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";
import { Typography } from "@mui/material";

export default function AdminHome() {
	const { user } = useAuth();
	const router = useRouter();

	React.useEffect(() => {
		if (!user || (user.role !== "ADMIN" && user.role !== "CITYADMIN")) {
			router.replace("/");
		}
	}, [user]);

	let dashboardContent = null;
	if (user?.role === "ADMIN") {
		dashboardContent = (
			<AdminLayout>
				<Typography variant="h1">Espace administrateur</Typography>
			</AdminLayout>
		);
	} else if (user?.role === "CITYADMIN") {
		dashboardContent = <h1>CityAdmin Dashboard</h1>;
	}

	return <>{dashboardContent}</>;
}
