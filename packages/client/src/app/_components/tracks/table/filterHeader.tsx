import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ListFilterPlusIcon } from "lucide-react";

interface FilterHeaderProps {
    content: string;
    filterOptions: string[];
    setFilter: (filter: string) => void;
    'data-testid'?: string;
}

export default function FilterHeader({ content, filterOptions, setFilter, 'data-testid': dataTestId }: FilterHeaderProps) {
    return (
        <span className="flex items-center gap-2">
            {content}
            <Select onValueChange={(value) => { setFilter(value) }} data-testid={dataTestId}>
                <SelectTrigger 
                    className="border-none outline-none shadow-none"
                    aria-label={`Filter by ${content}`}
                >
                    <ListFilterPlusIcon className="w-4 h-4" />
                </SelectTrigger>
                <SelectContent>
                    {filterOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </span>
    )
}