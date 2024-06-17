import React, { ReactNode } from "react";
import { Layout } from "./Layout";
import AdminSidebar from "./AdminSidebar";
import { Box, Toolbar } from "@mui/material";

const drawerWidth = 100;

const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<Box sx={{ display: "flex" }}>
			<AdminSidebar />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					bgcolor: "background.default",
					p: 3,
					marginLeft: `${drawerWidth}px`,
				}}
			>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
};

export default AdminLayout;
