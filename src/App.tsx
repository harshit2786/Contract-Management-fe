// import { useState } from 'react'
import { useEffect, useState } from "react";
import "./App.css";
import { FilterBar } from "./components/FilterBar";
import { Contract, ContractStatus } from "./types/models";
import ContractDialog from "./components/ContractModal";
import { ContractTable } from "./components/Contracts";
import { Button } from "./components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "./components/ui/pagination";
import axios from "axios";
import { useSocket } from "./hooks/useSockets";

function App() {
  const socket = useSocket();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "All">(
    "All"
  );
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchContracts = async (
    search: string,
    status: ContractStatus | "All",
    page: number
  ) => {
    try {
      const resp = await axios.get(
        `http://localhost:3000/api/get?search=${search}&status=${status}&page=${page}`
      );
      setContracts(resp.data.contracts);
      setTotalPages(resp.data.totalPages);
      setPage(resp.data.currentPage);
    } catch (e) {
      console.log(e);
    }
  };
  const handlePageChange = async (num: number) => {
    if (num === page) {
      return;
    }
    await fetchContracts(searchQuery, statusFilter, num);
  };
  useEffect(() => {
    const time = setTimeout(
      async () => await fetchContracts(searchQuery, statusFilter, 1),
      500
    );
    return () => clearTimeout(time);
  }, [searchQuery, statusFilter]);
  useEffect(() => {
    if (socket) {
      const handleMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        if (message.type === "delete") {
          setContracts((prevContracts) =>
            prevContracts.filter((contract) => contract.id !== message.id)
          );
        } else if (message.type === "update") {
          setContracts((prevContracts) =>
            prevContracts.map((contract) =>
              contract.id === message.contract.id ? message.contract : contract
            )
          );
        }
      };

      socket.addEventListener("message", handleMessage);
      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket]);
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
      <div className="w-full flex items-center justify-center py-8">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <Button
                  onClick={async () => await handlePageChange(index + 1)}
                  variant={page === index + 1 ? "secondary" : "ghost"}
                  className={`w-8 h-8 `}
                >
                  {index + 1}
                </Button>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default App;
