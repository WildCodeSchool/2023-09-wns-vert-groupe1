export type PoiType = {
	id?: number;
	name: string;
	address?: string;
	description: string;
	postalCode?: string;
	latitude?: number;
	longitude?: number;
	images: string[];
	category: CategoryType;
	ratings?: RatingType[];
};

export type CityType = {
	id?: number;
	name?: string;
	description?: string;
	pois?: PoiType[];
	lat?: number;
	lon?: number;
};

export type RatingType = {
	id: number;
	rating: number;
	text: string;
};

export type CategoryType = {
	id?: number;
	name: string;
};

export type CityMapProps = {
	lat?: number;
	lon?: number;
	pois?: {
		id: number;
		name: string;
		address: string;
		description: string;
		latitude: number;
		longitude: number;
	}[];
};

export type DisplayCitiesType = {
	cities: (CityType & CityMapProps)[];
	onClickDelete?: (adId: number) => void;
	onClickEdit?: (adId: number) => void;
};

export type POIInput = {
	id?: number;
	name: string;
	address: string;
	description: string;
	city: string;
	category: string;
	images: string[];
	postalCode?: string;
	latitude?: number;
	longitude?: number;
};

export type UserInput = {
	firstName: string;
	lastName: number;
	email: string;
	password: string;
	city?: number;
};
