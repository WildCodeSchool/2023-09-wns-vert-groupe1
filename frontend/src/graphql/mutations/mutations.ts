import { gql } from "@apollo/client";

export const CREATE_NEW_POI = gql`
	mutation createNewPoi($poiData: PoiInput!) {
		createNewPoi(poiData: $poiData) {
			id
		}
	}
`;

export const REGISTER = gql`
	mutation Register($newUserData: UserInput!) {
		register(newUserData: $newUserData)
	}
`;

export const CREATE_NEW_CITY = gql`
	mutation CreateNewCity($cityData: CityInput!) {
		createNewCity(cityData: $cityData) {
			id
			name
		}
	}
`;

export const DELETE_USER = gql`
	mutation DeleteUser($userId: String!) {
		deleteUser(userId: $userId)
	}
`;

export const UPDATE_USER = gql`
	mutation UpdateUser($userId: Int!, $userData: UpdateUserInput!) {
		updateUserById(id: $userId, newUserInput: $userData) {
			id
			firstName
			lastName
			email
			role
		}
	}
`;

export const CREATE_NEW_CATEGORY = gql`
	mutation CreateNewCategory($categoryData: CategoryInput!) {
		createNewCategory(categoryData: $categoryData) {
			id
			name
		}
	}
`;

export const DELETE_CATEGORY = gql`
	mutation deleteCategoryById($id: Float!) {
		deleteCategoryById(id: $id)
	}
`;
