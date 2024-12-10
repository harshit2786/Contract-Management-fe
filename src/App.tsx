// import { useState } from 'react'
import { useState } from "react";
import "./App.css";
// import { Contract, ContractStatus } from './types/models'
// import { Plus } from 'lucide-react';
import { FilterBar } from "./components/FilterBar";
import { Contract, ContractStatus } from "./types/models";
import ContractDialog from "./components/ContractModal";
import { ContractTable } from "./components/Contracts";
import { Button } from "./components/ui/button";
// import { ContractTable } from './components/Contracts';

const example: Contract = {
  id: "1",
  title: "Example",
  clientName: "Harshit",
  createdAt: "1733833067539",
  status: "Finalized",
  data: "abc",
  dataType: "text",
};

function App() {
  const [contracts, setContracts] = useState<Contract[]>([example]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [page,setpage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "All">(
    "All"
  );
  // const [totalPages,setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("fil", Date.now());
  return (
    <div className="h-screen w-screen text-white px-8 overflow-y-auto flex flex-col bg-gray-900">
      <ContractDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        type="create"
      />
      <h1 className="text-3xl font-bold my-8  ">Contract Management</h1>
      <div className="flex items-center justify-between">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <Button onClick={() => setIsModalOpen(true)} variant="secondary">
          Create Contract
        </Button>
      </div>
      <div className="w-full flex-1 overflow-y-auto">
        <ContractTable contracts={contracts} />
      </div>
    </div>
  );
}

export default App;
