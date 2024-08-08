import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_CITY_BY_NAME } from "@queries";
import { PoiCard, SearchForm, CityMap, Tag } from "@components";
import { CategoryType, CityType, PoiType } from "@types";
import {
	Box,
	CircularProgress,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	useMediaQuery,
	SelectChangeEvent,
} from "@mui/material";
import { mainTheme } from "@theme";
import { toast } from "react-toastify";

const defaultState: CityType = {
	name: "",
	description: "",
	pois: [],
	lat: undefined,
	lon: undefined,
};

const SearchResults = () => {
	const isTabletOrMobile = useMediaQuery(mainTheme.breakpoints.down("lg"));
	const router = useRouter();
	const [searchedCity, setSearchedCity] = useState<CityType>(defaultState);
	const [activePoiId, setActivePoiId] = useState<number | null>(null);
	const [categoryTags, setCategoryTags] = useState<CategoryType[]>([]);
	const [activeCategories, setActiveCategories] = useState<string[]>([]);
	const [filteredPois, setFilteredPois] = useState<PoiType[]>([]);
	const [dataFetched, setDataFetched] = useState<boolean>(false);

	const { loading, error, data } = useQuery(GET_CITY_BY_NAME, {
		variables: { name: router.query.keyword },
	});

	const defaultLatLon = {
		lat: 46.603354,
		lon: 1.888334,
	};

	// Reset dataFetched when a new search is started
	useEffect(() => {
		if (router.query.keyword) {
			setDataFetched(false);
		}
	}, [router.query.keyword]);

	useEffect(() => {
		if (error) {
			toast.error("Une erreur est survenue lors de la recherche.");
			setSearchedCity(defaultState);
			console.error("Error fetching city:", error.message);
			setDataFetched(true);
		}

		if (!loading && data && data.getCityByName) {
			const cityData = data.getCityByName;
			setSearchedCity({
				id: cityData.id,
				name: cityData.name,
				description: cityData.description,
				pois: cityData.pois || [],
				lon: cityData.lon,
				lat: cityData.lat,
			});
			const categories: CategoryType[] = [];
			cityData.pois.forEach((poi: PoiType) => {
				if (poi.category && !categories.includes(poi.category)) {
					categories.push(poi.category);
				}
			});

			setCategoryTags(categories);
			setFilteredPois(cityData.pois!);
			setDataFetched(true);
		}
	}, [data, error, loading, router.query.keyword]);

	useEffect(() => {
		if (activeCategories.length === 0) {
			setFilteredPois(searchedCity.pois!);
		} else {
			const filtered = searchedCity.pois!.filter(
				(poi) => poi.category && activeCategories.includes(poi.category.name)
			);
			setFilteredPois(filtered);
		}
	}, [activeCategories, searchedCity.pois]);

	const scrollToPoi = (poiId: number) => {
		setActivePoiId(poiId);
		const poiElementId = `poi-${poiId}`;

		const poiElement = document.getElementById(poiElementId);

		if (poiElement) {
			poiElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	const handleMouseOverPoi = (poiId: number) => {
		setActivePoiId(poiId);
	};

	const handleMouseOutPoi = () => {
		setActivePoiId(null);
	};

	const handleCategoryTagClick = (categoryName: string) => {
		if (categoryName === "Tous les catégories") {
			setActiveCategories([]);
		} else {
			setActiveCategories((prevActiveCategories) => {
				if (prevActiveCategories.includes(categoryName)) {
					return prevActiveCategories.filter((name) => name !== categoryName);
				} else {
					return [...prevActiveCategories, categoryName];
				}
			});
		}
	};

	const handleCategorySelectChange = (event: SelectChangeEvent<string>) => {
		const selectedCategory = event.target.value as string;
		if (selectedCategory === "Tous les catégories") {
			setActiveCategories([]);
		} else {
			setActiveCategories([selectedCategory]);
		}
	};

	const renderDesktopView = () => (
		<Box display="flex" width="100%">
			<Box flex="1" height="100vh" overflow="auto">
				<Box padding={mainTheme.spacing(6)}>
					<SearchForm />
				</Box>

				{searchedCity.name !== "" && data ? (
					<>
						<Box
							display="flex"
							alignItems="center"
							gap={mainTheme.spacing(3)}
							paddingX={mainTheme.spacing(6)}
						>
							<Tag
								key={"category-tag-all-categories"}
								name="Tous les catégories"
								isActive={activeCategories.length === 0}
								onClick={() => handleCategoryTagClick("Tous les catégories")}
							/>
							{categoryTags.map((category) => (
								<Tag
									key={category.id}
									name={category.name}
									isActive={activeCategories.includes(category.name)}
									onClick={() => handleCategoryTagClick(category.name)}
								/>
							))}
						</Box>
						<Box padding={mainTheme.spacing(6)}>
							<Typography
								sx={{
									color: mainTheme.palette.primary.dark,
									fontSize: mainTheme.typography.h3,
									fontWeight: "bold",
								}}
							>
								{searchedCity.name} ({filteredPois.length})
							</Typography>
							{filteredPois.length > 0 ? (
								<>
									{filteredPois.map((poi) => (
										<PoiCard
											id={poi.id}
											key={poi.id}
											name={poi.name}
											images={poi.images}
											category={poi.category}
											description={poi.description}
											onMouseOver={() => handleMouseOverPoi(poi.id)}
											onMouseOut={handleMouseOutPoi}
										/>
									))}
								</>
							) : (
								<Typography>
									Cette ville ne possède pas encore de point d&apos;intérêt.
								</Typography>
							)}
						</Box>
					</>
				) : (
					dataFetched && (
						<Box
							display="flex"
							alignItems="center"
							gap={mainTheme.spacing(3)}
							paddingX={mainTheme.spacing(6)}
						>
							<Typography
								sx={{
									color: mainTheme.palette.error.main,
									mb: mainTheme.spacing(2),
								}}
							>
								Aucune ville trouvée pour le terme de recherche :{" "}
								{router.query.keyword}
							</Typography>
						</Box>
					)
				)}
			</Box>
			{dataFetched && (
				<Grid item flex="1" display="grid">
					<CityMap
						lat={searchedCity.lat || defaultLatLon.lat}
						lon={searchedCity.lon || defaultLatLon.lon}
						pois={filteredPois}
						activePoiId={activePoiId}
						onMarkerClick={(poiId) => scrollToPoi(poiId)}
					/>
				</Grid>
			)}
		</Box>
	);

	const renderMobileView = () => (
		<Box sx={{ width: "100vw", height: "100vh" }}>
			<Box sx={{ position: "relative", height: "100%" }}>
				<CityMap
					lat={searchedCity.lat || defaultLatLon.lat}
					lon={searchedCity.lon || defaultLatLon.lon}
					pois={filteredPois}
					activePoiId={activePoiId}
					onMarkerClick={(poiId) => scrollToPoi(poiId)}
				/>
				<Box
					sx={{
						position: "absolute",
						top: 0,
						width: "100%",
						padding: "10px",
					}}
				>
					<Box flex={1}>
						<SearchForm />
					</Box>
					{searchedCity.name !== "" ? (
						<FormControl
							id="category-select-label"
							variant="filled"
							sx={{
								minWidth: 120,
								marginTop: mainTheme.spacing(2),
								marginLeft: mainTheme.spacing(1),
							}}
						>
							<InputLabel sx={{ color: mainTheme.palette.primary.main }}>
								Catégorie
							</InputLabel>
							<Select
								label="Categorie"
								labelId="category-select-label"
								id="category-select"
								value={activeCategories[0] || "Tous les catégories"}
								onChange={handleCategorySelectChange}
								sx={{
									background: mainTheme.palette.background.paper,
									"& .MuiSelect-filled": {
										backgroundColor: mainTheme.palette.background.paper,
									},
									"&:hover": {
										backgroundColor: mainTheme.palette.background.paper,
									},
									"&.Mui-focused": {
										backgroundColor: mainTheme.palette.background.paper,
									},
								}}
							>
								<MenuItem
									value="Tous les catégories"
									color={mainTheme.palette.primary.main}
								>
									Tous les catégories
								</MenuItem>
								{categoryTags.map((category) => (
									<MenuItem
										key={category.id}
										value={category.name}
										color={mainTheme.palette.primary.main}
										sx={{ background: mainTheme.palette.background.paper }}
									>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					) : (
						dataFetched && (
							<Typography
								sx={{
									color: mainTheme.palette.error.main,
									mt: mainTheme.spacing(2),
									ml: mainTheme.spacing(1),
								}}
								textAlign="center"
							>
								Aucune ville trouvée pour le terme de recherche :{" "}
								{router.query.keyword}
							</Typography>
						)
					)}
				</Box>

				{filteredPois.length > 0 && activePoiId !== null && (
					<Box
						bgcolor={mainTheme.palette.background.paper}
						boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
						sx={{
							position: "fixed",
							bottom: "0",
							left: "50%",
							transform: "translateX(-50%)",
							width: "100%",
							zIndex: "2",
						}}
					>
						{filteredPois.map(
							(poi) =>
								poi.id === activePoiId && (
									<PoiCard
										id={poi.id}
										key={poi.id}
										name={poi.name}
										images={poi.images}
										category={poi.category}
										description={poi.description}
										onMouseOver={() => handleMouseOverPoi(poi.id)}
										onMouseOut={handleMouseOutPoi}
									/>
								)
						)}
					</Box>
				)}
			</Box>
		</Box>
	);

	if (loading) {
		return <CircularProgress />;
	}

	if (isTabletOrMobile) {
		return renderMobileView();
	}

	return renderDesktopView();
};

export default SearchResults;
