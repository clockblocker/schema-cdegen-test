interface YesNoPickerProps {
	label: string;
	value: boolean | undefined;
	onChange: (value: boolean | undefined) => void;
	error?: string;
}

export function YesNoPicker({
	label,
	value,
	onChange,
	error,
}: YesNoPickerProps) {
	return (
		<fieldset className="flex flex-col gap-2">
			<legend className="font-semibold text-white">{label}</legend>
			<div className="flex gap-4">
				<button
					type="button"
					className={`rounded px-4 py-2 font-medium ${
						value === true
							? "bg-green-500 text-white"
							: "bg-white/10 text-white hover:bg-white/20"
					}`}
					onClick={() => onChange(value === true ? undefined : true)}
				>
					Yes
				</button>
				<button
					type="button"
					className={`rounded px-4 py-2 font-medium ${
						value === false
							? "bg-red-500 text-white"
							: "bg-white/10 text-white hover:bg-white/20"
					}`}
					onClick={() => onChange(value === false ? undefined : false)}
				>
					No
				</button>
			</div>
			{error && <p className="text-red-400 text-sm">{error}</p>}
		</fieldset>
	);
}
