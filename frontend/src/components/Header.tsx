import React from "react";
import Link from "next/link";
import { AppBar, Stack, Toolbar, Typography, Box } from "@mui/material";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { mainTheme } from "@theme";
import { useAuth } from "../context";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import useWindowDimensions from "../utils/windowDimensions";
import Logo from "./Logo";

export const Header = () => {
	const { onLogout, isAuthenticated, user } = useAuth();
	const { height, width } = useWindowDimensions();
	const router = useRouter();

	return (
		<AppBar position="static" sx={{ zIndex: 10000 }}>
			<Toolbar
				sx={{
					boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
					width: width,
					backgroundColor: mainTheme.palette.primary.main,
					height: (height * 2) / 100,
					position: "relative",
				}}
			>
				<Box
					sx={{
						position: "absolute",
						left: 0,
					}}
				>
					<Link href="/" passHref>
						<Typography
							color="inherit"
							sx={{
								letterSpacing: "0.04em",
								paddingLeft: mainTheme.spacing(3),
							}}
						>
							CITY GUIDE
						</Typography>
					</Link>
				</Box>
				<Box
					paddingBottom={mainTheme.spacing(1)}
					style={{
						position: "absolute",
						left: "50%",
						transform: "translateX(-50%)",
					}}
				>
					<Logo />
				</Box>
				<Box
					sx={{
						position: "absolute",
						right: 0,
					}}
				>
					{isAuthenticated ? (
						<Stack flexDirection="row" gap={4}>
							{(user?.role === "ADMIN" || user?.role === "CITYADMIN") && (
								<AdminPanelSettingsIcon
									onClick={() => {
										router.push("/admin");
									}}
									sx={{
										fontSize: mainTheme.typography.h3,
										cursor: "pointer",
									}}
								/>
							)}
							<AccountCircleIcon
								onClick={() => router.push("/profil")}
								sx={{
									fontSize: mainTheme.typography.h3,
									cursor: "pointer",
								}}
							/>
							<LogoutIcon
								onClick={onLogout}
								sx={{
									fontSize: mainTheme.typography.h3,
									cursor: "pointer",
									mr: mainTheme.spacing(3),
								}}
							/>
						</Stack>
					) : (
						<Link href="/login" passHref>
							<AccountCircleIcon
								sx={{
									fontSize: mainTheme.typography.h2,
									mr: mainTheme.spacing(3),
								}}
							/>
						</Link>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};
