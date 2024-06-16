"use client";
import { Map, Marker } from "react-map-gl";
import { CityType } from "@types";
import { mainTheme } from "@theme";

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

	return (
		<Map
			key={key}
			mapboxAccessToken="pk.eyJ1IjoibWVpamU4IiwiYSI6ImNsczF1ZXlqczBjeW4yanBjZzNsbXFuZncifQ.7Z0qk6v18gniDPLKIctVQA"
			latitude={lat}
			longitude={lon}
			zoom={10}
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
								<svg
									height={poi.id === activePoiId ? "30" : "25"}
									viewBox="0 0 24 24"
									style={{
										cursor: "pointer",
										fill: mainTheme.palette.primary.light,
										opacity: poi.id === activePoiId ? 1 : 0.63,
										stroke: "none",
										transform: "translate(-12px, -24px)",
									}}
								>
									<circle cx="12" cy="12" r="10" />
								</svg>
							</Marker>
						)
				)}
		</Map>
	);
};
export default CityMap;
