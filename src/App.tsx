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
import { FallingLines } from "react-loader-spinner";
import { Toaster } from "./components/ui/toaster";

function App() {
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const resp = await axios.get(
        `${import.meta.env.VITE_BACKEND_IP_ADDRESS}/api/get?search=${search}&status=${status}&page=${page}`
      );
      setContracts(resp.data.contracts);
      setTotalPages(resp.data.totalPages);
      setPage(resp.data.currentPage);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  const handlePageChange = async (num: number) => {
    if (num === page) {
      return;
    }
    await fetchContracts(searchQuery, statusFilter, num);
  };
  useEffect(() => {
    setLoading(true);
    const time = setTimeout(
      async () => await fetchContracts(searchQuery, statusFilter, 1),
      500
    );
    return () => clearTimeout(time);
  }, [searchQuery, statusFilter]);
  useEffect(() => {
    if (socket) {
      const handleMessage = async (event: MessageEvent) => {
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
  useEffect(() => {
    if (contracts.length === 0 && page > 1) {
      fetchContracts(searchQuery, statusFilter, page - 1);
    }
  }, [contracts, page]);
  return (
    <div className="h-screen w-screen text-white overflow-y-auto flex flex-col bg-gray-900">
      <div className="h-16 bg-gray-950 border-b flex items-center justify-between ">
        <div className="text-3xl text-white font-bold text-primary ml-8">TractUs Labs</div>
        
      </div>
      <Toaster />
      <div className="px-8 h-full flex-1 flex flex-col">
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
        {loading ? (
          <div className="w-full flex-1 flex items-center justify-center">
            <FallingLines color="white" width="100" visible={true} />
          </div>
        ) : (
          <div className="w-full flex-1 overflow-y-auto">
            <ContractTable contracts={contracts} />
          </div>
        )}
        {!loading && totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}

export default App;
