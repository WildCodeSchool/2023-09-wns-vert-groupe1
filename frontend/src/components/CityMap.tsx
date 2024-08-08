"use client";
import { Map, Marker } from "react-map-gl";
import { CityType } from "@types";
import { mainTheme } from "@theme";
import { SvgIconProps, useMediaQuery } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import AttractionsIcon from "@mui/icons-material/Attractions";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MuseumIcon from "@mui/icons-material/Museum";

type CityMapProps = CityType & {
	activePoiId: number | null;
	onMarkerClick: (id: number) => void;
};

export const CityMap = ({
	lat,
	lon,
	pois,
	activePoiId,
	onMarkerClick,
}: CityMapProps) => {
	const key = `${lat}-${lon}`;

	const handleMarkerClick = (poiId: number) => {
		onMarkerClick(poiId);
	};
	const isTabletOrMobile = useMediaQuery(mainTheme.breakpoints.down("lg"));

	const getIconByCategory = (
		category: string | undefined,
		isActive: boolean
	): React.ReactElement<SvgIconProps> => {
		const iconStyle = {
			fontSize: isActive ? 40 : 30,
			color: isActive
				? mainTheme.palette.primary.main
				: mainTheme.palette.primary.light,
		};

		switch (category) {
			case "Restaurants":
				return <RestaurantIcon style={iconStyle} />;
			case "Monuments":
				return <LocationCityIcon style={iconStyle} />;
			case "Hotel":
				return <LocalHotelIcon style={iconStyle} />;
			case "Cafe":
				return <LocalCafeIcon style={iconStyle} />;
			case "Attraction":
				return <AttractionsIcon style={iconStyle} />;
			case "Musées":
				return <MuseumIcon style={iconStyle} />;
			default:
				return <HelpOutlineIcon style={iconStyle} />;
		}
	};

	return (
		<Map
			key={key}
			mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
			initialViewState={{
				latitude: lat,
				longitude: lon,
				zoom: isTabletOrMobile ? 11 : 12,
			}}
			scrollZoom={true}
			dragPan={true}
			dragRotate={true}
			doubleClickZoom={true}
			touchZoomRotate={true}
			mapStyle="mapbox://styles/mapbox/dark-v11"
		>
			{pois &&
				pois.length > 0 &&
				pois.map(
					(poi) =>
						poi.latitude !== undefined &&
						poi.longitude !== undefined && (
							<Marker
								key={poi.id}
								latitude={poi.latitude}
								longitude={poi.longitude}
								onClick={() => handleMarkerClick(poi.id)}
							>
								<div>
									{getIconByCategory(
										poi.category?.name,
										poi.id === activePoiId
									)}
								</div>
							</Marker>
						)
				)}
		</Map>
	);
};
export default CityMap;
