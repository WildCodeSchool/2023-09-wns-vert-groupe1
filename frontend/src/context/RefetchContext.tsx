import React, { createContext, useContext, useState } from "react";

type RefetchContextType = {
	refetchCategories: () => void;
	setRefetchCategories: (refetch: () => void) => void;
	refetchUsers: () => void;
	setRefetchUsers: (refetch: () => void) => void;
};

const RefetchContext = createContext<RefetchContextType | undefined>(undefined);

export const RefetchProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [refetchCategories, setRefetchCategories] = useState<() => void>(
		() => () => {}
	);
	const [refetchUsers, setRefetchUsers] = useState<() => void>(() => () => {});

	return (
		<RefetchContext.Provider
			value={{
				refetchCategories,
				setRefetchCategories,
				refetchUsers,
				setRefetchUsers,
			}}
		>
			{children}
		</RefetchContext.Provider>
	);
};

export const useRefetch = () => {
	const context = useContext<RefetchContextType | undefined>(RefetchContext);
	if (!context) {
		throw new Error("useRefetch must be used within a RefetchProvider");
	}
	return context;
};
