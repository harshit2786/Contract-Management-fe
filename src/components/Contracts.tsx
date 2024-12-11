import { EllipsisVerticalIcon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Contract } from "../types/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatTimestamp } from "@/lib/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import ContractDialog from "./ContractModal";
import { useState } from "react";
import axios from "axios";
import { useSocket } from "@/hooks/useSockets";

export const ContractTable = ({ contracts }: { contracts: Contract[] }) => {
  const socket = useSocket();
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete/${id}`);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'delete', id }));
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="w-full">
      {selectedContract && (
        <ContractDialog
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          type="update"
          contract={selectedContract}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Contract ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((con, index) => (
            <TableRow className="hover:bg-gray-950" key={index}>
              <TableCell>{con.id}</TableCell>
              <TableCell>{con.title}</TableCell>
              <TableCell>{con.clientName}</TableCell>
              <TableCell>
                <StatusBadge status={con.status} />
              </TableCell>
              <TableCell>{formatTimestamp(con.createdAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button className="w-8 h-8" variant="ghost">
                      <EllipsisVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className=" cursor-pointer"
                      onClick={() => {
                        setSelectedContract(con);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit{" "}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className=" cursor-pointer"
                      onClick={async () => await handleDelete(con.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 p-4 border-t border-gray-700">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => useContractStore.getState().setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      )} */}
    </div>
  );
};
