import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_CITY_BY_NAME } from "@queries";
import { PoiCard, SearchForm, CityMap, Tag } from "@components";
import { CategoryType, CityType, PoiType } from "@types";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
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
	const latFrance = 46.603354;
	const lonFrance = 1.888334;
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

	useEffect(() => {
		if (error) {
			toast.error("Une erreur est survenue lors de la recherche.");
			searchedCity ?? setSearchedCity(defaultState);
			setDataFetched(true);
		}

		if (!loading && data && data.getCityByName) {
			console.log(data.getCityByName);
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

	return loading ? (
		<CircularProgress />
	) : (
		<Grid
			container
			display="flex"
			flexGrow={1}
			sx={{ sm: "column", md: "column", lg: "row", xl: "row" }}
		>
			<Grid
				item
				display="grid"
				flex="1"
				maxHeight={window.innerHeight - 120}
				overflow="auto"
				alignContent="flex-start"
				gap={4}
			>
				<Box padding={mainTheme.spacing(6)}>
					<SearchForm />
				</Box>
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
				{searchedCity.name !== "" && data!! ? (
					<Box
						padding={mainTheme.spacing(6)}
						display="flex"
						flexDirection="column"
						gap={6}
					>
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
								{filteredPois?.map((poi) => (
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
				) : (
					dataFetched && (
						<Typography
							sx={{
								color: mainTheme.palette.error.main,
								mb: mainTheme.spacing(2),
							}}
						>
							Aucune ville trouvée pour le terme de recherche :{" "}
							{router.query.keyword}
						</Typography>
					)
				)}
			</Grid>
			<Grid item flex="1" display="grid">
				{dataFetched && (
					<CityMap
						lat={searchedCity.lat}
						lon={searchedCity.lon}
						pois={searchedCity.pois}
						activePoiId={activePoiId}
						onMarkerClick={(poiId) => scrollToPoi(poiId)}
					/>
				)}
			</Grid>
		</Grid>
	);
};

export default SearchResults;
