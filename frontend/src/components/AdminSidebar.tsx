import React from "react";
import { Drawer, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import Link from "next/link";
import { mainTheme } from "@theme";

const drawerWidth = 270;

const AdminSidebar: React.FC = () => {
	return (
		<Drawer
			variant="permanent"
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					backgroundColor: mainTheme.palette.primary.light,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				},
			}}
		>
			<Toolbar />
			<List>
				<ListItem
					button
					component={Link}
					href="/admin/cities/cities"
					sx={{
						backgroundColor: mainTheme.palette.background.default,
						marginBottom: "2rem",
						marginTop: "1rem",
						borderRadius: "24px",
						marginLeft: "0.5rem",
						marginRight: "0.5rem",
						maxWidth: "calc(100% - 1rem)",
						boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
					}}
				>
					<ListItemText
						primary={<span style={{ fontSize: "0.9rem" }}>VILLES</span>}
						sx={{
							textAlign: "center",
						}}
					/>
				</ListItem>
				<ListItem
					button
					component={Link}
					href="/admin/pois/pois"
					sx={{
						backgroundColor: mainTheme.palette.background.default,
						marginBottom: "2rem",
						marginTop: "1rem",
						borderRadius: "24px",
						marginLeft: "0.5rem",
						marginRight: "0.5rem",
						maxWidth: "calc(100% - 1rem)",
						boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
					}}
				>
					<ListItemText
						primary={
							<span style={{ fontSize: "0.8rem" }}>POINTS D'INTERETS</span>
						}
						sx={{
							textAlign: "center",
						}}
					/>
				</ListItem>
				<ListItem
					button
					component={Link}
					href="/admin/users/users"
					sx={{
						backgroundColor: mainTheme.palette.background.default,
						marginBottom: "2rem",
						marginTop: "1rem",
						borderRadius: "24px",
						marginLeft: "0.5rem",
						marginRight: "0.5rem",
						maxWidth: "calc(100% - 1rem)",
						boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
					}}
				>
					<ListItemText
						primary={<span style={{ fontSize: "0.8rem" }}>UTILISATEURS</span>}
						sx={{
							textAlign: "center",
						}}
					/>
				</ListItem>
				<ListItem
					button
					component={Link}
					href="/admin/categories/categories"
					sx={{
						backgroundColor: mainTheme.palette.background.default,
						marginBottom: "2rem",
						marginTop: "1rem",
						borderRadius: "24px",
						marginLeft: "0.5rem",
						marginRight: "0.5rem",
						maxWidth: "calc(100% - 1rem)",
						boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
					}}
				>
					<ListItemText
						primary={<span style={{ fontSize: "0.8rem" }}>CATEGORIES</span>}
						sx={{
							textAlign: "center",
						}}
					/>
				</ListItem>
			</List>
		</Drawer>
	);
};

export default AdminSidebar;
