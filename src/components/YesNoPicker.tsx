import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export type YesNo = "Yes" | "No";

interface YesNoPickerProps {
	label: string;
	value: YesNo | undefined;
	onChange: (value: YesNo | undefined) => void;
	error?: string;
}

export function YesNoPicker({
	label,
	value,
	onChange,
	error,
}: YesNoPickerProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label>{label}</Label>
			<ToggleGroup
				type="single"
				variant="outline"
				value={value ?? ""}
				onValueChange={(v) => onChange((v || undefined) as YesNo | undefined)}
			>
				<ToggleGroupItem value="Yes">Yes</ToggleGroupItem>
				<ToggleGroupItem value="No">No</ToggleGroupItem>
			</ToggleGroup>
			{error && <p className="text-destructive text-sm">{error}</p>}
		</div>
	);
}
