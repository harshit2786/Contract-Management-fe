export type ContractStatus = 'Draft' | 'Finalized';
export type DataType = 'text' | 'json';

export interface Contract {
  id: string;
  clientName: string;
  title: string;
  status: ContractStatus;
  dataType: DataType;
  data: string;
  createdAt: string;
}