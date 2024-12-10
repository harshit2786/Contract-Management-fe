import { FilterIcon } from "lucide-react";
import { ContractStatus } from "../types/models";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./ui/select";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ContractStatus | "All";
  setStatusFilter: (status: ContractStatus | "All") => void;
}

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: FilterBarProps) => {
  //   const [searchQuery,setSearchQuery] = useState('');
  //   const [statusFilter,setStatusFilter] = useState<ContractStatus | 'all'>('all')

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Input
          size={40}
          type="text"
          placeholder="Search contracts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Select
        defaultValue="All"
        value={statusFilter}
        onValueChange={setStatusFilter}
      >
        <SelectTrigger className="w-[220px]">
            <div className="flex items-center gap-2"><FilterIcon width={14} /> {statusFilter === "All" ? "All Contracts" : statusFilter === "Draft" ? "Drafted Contracts" : "Finalized Contracts"}</div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Contracts</SelectItem>
          <SelectItem value="Draft">Drafted Contracts</SelectItem>
          <SelectItem value="Finalized">Finalized Contracts</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
