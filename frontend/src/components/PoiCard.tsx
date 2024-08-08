import {
	Box,
	Grid,
	IconButton,
	Rating,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { mainTheme } from "@theme";
import { PoiType } from "@types";
import {
	Favorite as FavoriteIcon,
	ArrowRight,
	Star,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/router";

export const PoiCard = ({
	name,
	images,
	category,
	description,
	id,
	onMouseOver,
	onMouseOut,
}: PoiType & { onMouseOver?: () => void; onMouseOut?: () => void }) => {
	const router = useRouter();
	const isTabletOrMobile = useMediaQuery(mainTheme.breakpoints.down("lg"));
	const isMobile = useMediaQuery(mainTheme.breakpoints.down("sm"));
	const isTablette = useMediaQuery(mainTheme.breakpoints.between("sm", "md"));

	const [isFavorite, setIsFavorite] = useState(false);

	const handleFavoriteClick = () => {
		setIsFavorite(!isFavorite);
	};

	const rating = 4;

	const handleClick = () => {
		router.push(`/poi/${id}`);
	};

	const renderDesktopCard = () => (
		<Box
			id={`poi-${id}`}
			marginTop={2}
			marginBottom={10}
			bgcolor={mainTheme.palette.secondary.contrastText}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				paddingBottom={mainTheme.spacing(2)}
			>
				<Typography
					component="strong"
					color={mainTheme.palette.primary.dark}
					sx={{
						fontSize: mainTheme.typography.h4,
						fontWeight: "bold",
					}}
				>
					{name}
				</Typography>
				<IconButton
					aria-label="favorite"
					onClick={handleFavoriteClick}
					sx={{
						padding: 0,
					}}
				>
					<FavoriteIcon
						sx={{
							color: isFavorite
								? mainTheme.palette.error.main
								: mainTheme.palette.primary.contrastText,
						}}
					/>
				</IconButton>
			</Box>
			<Box
				display="flex"
				gap={mainTheme.spacing(2)}
				marginBottom={mainTheme.spacing(6)}
			>
				{images && images.length > 0 && (
					<>
						<Box style={{ width: "50%", aspectRatio: "1 / 1" }}>
							<img
								src={images[0]}
								alt={`Image 1`}
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									borderRadius: "8px",
								}}
							/>
						</Box>
						<Box
							display="flex"
							flexDirection="column"
							flex="1"
							gap={mainTheme.spacing(2)}
						>
							<Box display="flex" gap={mainTheme.spacing(2)}>
								{images.slice(1, 3).map((image, index) => (
									<Box
										key={index + 1}
										style={{ width: "50%", aspectRatio: "1 / 1" }}
									>
										<img
											src={image}
											alt={`Image ${index + 2}`}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: "8px",
											}}
										/>
									</Box>
								))}
							</Box>
							<Box display="flex" gap={mainTheme.spacing(2)}>
								{images.slice(3, 5).map((image, index) => (
									<Box
										key={index + 3}
										style={{ width: "50%", aspectRatio: "1 / 1" }}
									>
										<img
											src={image}
											alt={`Image ${index + 4}`}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: "8px",
											}}
										/>
									</Box>
								))}
							</Box>
						</Box>
					</>
				)}
			</Box>
			<Typography
				component="strong"
				color={mainTheme.palette.primary.dark}
				sx={{
					fontSize: mainTheme.typography.h4,
					fontWeight: "bold",
				}}
			>
				{category.name}
			</Typography>
			<Typography
				color={mainTheme.palette.primary.dark}
				sx={{
					fontSize: mainTheme.typography.h5,
					marginTop: mainTheme.spacing(2),
					marginBottom: mainTheme.spacing(2),
				}}
			>
				{description}
			</Typography>
			<Box display="flex" flexDirection="row" justifyContent="space-between">
				<Box display="flex" alignItems="center" marginBottom={1}>
					{[...Array(5)].map((_, index) => (
						<Star
							key={index}
							sx={{
								color:
									index < Math.floor(rating)
										? mainTheme.palette.primary.dark
										: mainTheme.palette.secondary.light,
							}}
						/>
					))}
				</Box>
				<Box
					flexDirection="row"
					display="flex"
					onClick={handleClick}
					sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
				>
					<Typography color={mainTheme.palette.secondary.dark}>
						VOIR LE DETAIL
					</Typography>
					<ArrowRight sx={{ color: mainTheme.palette.secondary.dark }} />
				</Box>
			</Box>
		</Box>
	);

	const renderMobileCard = () => (
		<Grid
			container
			alignItems="stretch"
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
			sx={{ height: "100%" }}
		>
			{images && images.length > 0 && (
				<Grid item xs={6}>
					<Box
						component="img"
						src={images[0]}
						alt="Description Image"
						sx={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
					/>
				</Grid>
			)}
			<Grid item xs={6} padding={mainTheme.spacing(3)}>
				<Box
					display="flex"
					justifyContent="space-between"
					marginBottom={mainTheme.spacing(2)}
				>
					<Typography
						component="strong"
						color={mainTheme.palette.primary.dark}
						sx={{
							fontSize: mainTheme.typography.h4,
							fontWeight: "bold",
						}}
					>
						{name}
					</Typography>
					<IconButton
						aria-label="favorite"
						onClick={handleFavoriteClick}
						sx={{
							padding: 0,
						}}
					>
						<FavoriteIcon
							sx={{
								color: isFavorite
									? mainTheme.palette.error.main
									: mainTheme.palette.primary.contrastText,
							}}
						/>
					</IconButton>
				</Box>
				<Typography
					component="strong"
					color={mainTheme.palette.primary.dark}
					sx={{
						fontSize: mainTheme.typography.h5,
						fontWeight: "bold",
					}}
				>
					{category.name}
				</Typography>
				<Typography
					color={mainTheme.palette.primary.dark}
					sx={{
						fontSize: isMobile
							? mainTheme.typography.h6
							: mainTheme.typography.h5,
						marginTop: mainTheme.spacing(2),
						marginBottom: mainTheme.spacing(2),
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "-webkit-box",
						WebkitLineClamp: isMobile ? 2 : 5,
						WebkitBoxOrient: "vertical",
					}}
				>
					{description}
				</Typography>
				<Box
					display="flex"
					justifyContent="space-between"
					flexDirection="column"
				>
					<Box
						display="flex"
						alignItems="center"
						marginTop={isTablette ? mainTheme.spacing(5) : mainTheme.spacing(3)}
					>
						<Rating
							value={rating}
							precision={0.5}
							sx={{
								color: mainTheme.palette.primary.dark,
								fontSize: isMobile ? mainTheme.typography.h6 : "none",
							}}
						/>
					</Box>
					<Box
						display="flex"
						alignItems="center"
						onClick={handleClick}
						sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
						flexWrap="nowrap"
					>
						<Typography
							color={mainTheme.palette.secondary.dark}
							sx={{
								fontSize: mainTheme.typography.h5,
							}}
						>
							VOIR LE DETAIL
						</Typography>
						<ArrowRight sx={{ color: mainTheme.palette.secondary.dark }} />
					</Box>
				</Box>
			</Grid>
		</Grid>
	);

	return isTabletOrMobile ? renderMobileCard() : renderDesktopCard();
};
