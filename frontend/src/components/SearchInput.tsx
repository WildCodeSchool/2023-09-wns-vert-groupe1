import { InputBase } from "@mui/material";
import { mainTheme } from "@theme";

type SearchInputProps = {
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder: string;
	error?: boolean;
};

export const SearchInput = ({
	name,
	value,
	onChange,
	placeholder,
	error,
}: SearchInputProps) => (
	<InputBase
		type="text"
		fullWidth
		name={name}
		placeholder={placeholder}
		value={value}
		onChange={onChange}
		style={{
			border: "none",
			outline: "none",
			fontSize: mainTheme.typography.h6.fontSize,
			color: mainTheme.palette.primary.main,
			borderBottom: error
				? `1px solid ${mainTheme.palette.error.main}`
				: "none",
		}}
	/>
);
