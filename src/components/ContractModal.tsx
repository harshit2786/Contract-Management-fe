import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contract, ContractStatus, DataType } from "@/types/models";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useSocket } from "@/hooks/useSockets";

export default function ContractDialog({
  type,
  contract,
  isOpen,
  setIsOpen,
}: {
  type: "update" | "create";
  contract?: Contract;
  isOpen : boolean;
  setIsOpen : (e : boolean) => void,
}) {
  const socket = useSocket();
  const [title, setTitle] = useState(contract ? contract.title : "");
  const [clientName, setClientName] = useState(
    contract ? contract.clientName : ""
  );
  const [status, setStatus] = useState<ContractStatus>(
    contract ? contract.status : "Draft"
  );
  const [data, setData] = useState(contract ? contract.data : "");
  const [dataType, setDataType] = useState<DataType>(
    contract ? contract.dataType : "text"
  );
  const handleUpdate = async() => {
    const payload = {
        status,
        title,
        clientName,
        dataType,
        data
    }
    try{
        const resp = await axios.put(`http://localhost:3000/api/update/${contract?.id}`,payload);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'update', id : resp.data.id }));
        }
        setIsOpen(false);
    } catch(e){
        console.log(e)
    }
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        let content = e.target?.result as string;
        const fileType = file.type;
        if (fileType === "application/json") {
          setDataType("json");
          try {
            const json = JSON.parse(content);
            content = JSON.stringify(json, null, 2); 
          } catch (e) {
            console.error("Invalid JSON file",e);
          }
        } else if (fileType === "text/plain") {
          setDataType("text");
        }

        setData(content);
      };
      reader.readAsText(file);
    }
  };

  const handleCreate = async () => {
    const payload = {
        dataType,
        data,
        clientName,
        title
    }
    try{
        await axios.post('http://localhost:3000/api/create',payload);
        window.location.reload();
    }
    catch(e){
        console.log(e)
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-[90vh] border-none flex flex-col gap-8 max-w-[80vw] bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-100">
            {type === "create" ? "Add Contract" : "Update Contract"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 gap-8 w-full ">
          <div className="w-[40%] flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label title="" className="text-gray-100">Title</Label>
              <Input 
                className="bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label title="" className="text-gray-100">Client Name</Label>
              <Input 
                className="bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)} 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label title="" className="text-gray-100">Type</Label>
              <Select
                value={dataType}
                onValueChange={(e: DataType) => setDataType(e)}
              >
                <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-gray-100">
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {type === "update" && (
              <div>
                <Label title="" className="text-gray-100">Status</Label>
                <Select
                  value={status}
                  onValueChange={(e: ContractStatus) => setStatus(e)}
                >
                  <SelectTrigger className="bg-gray-700 text-gray-100 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-gray-100">
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Finalized">Finalized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label title="" className="text-gray-100">Upload File</Label>
              <Input
                type="file"
                accept=".txt, .json"
                onChange={handleFileChange}
                className="bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600"
              />
            </div>
          </div>
          <div className="w-[60%] flex flex-col gap-4 h-full">
            <Label className="text-gray-100">Contract Data</Label>
            <div className="flex-1 border border-gray-600 rounded-md overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage={dataType === "json" ? "json" : "plaintext"}
                value={data}
                onChange={(value) => setData(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="">
          <Button onClick={type === "create" ? handleCreate : handleUpdate}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
