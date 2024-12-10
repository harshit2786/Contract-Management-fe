import { ContractStatus } from '../types/models'; 

export const StatusBadge= ({ status } : {status : ContractStatus}) => {
  const styles = {
    Draft: 'bg-yellow-900 text-yellow-300',
    Finalized: 'bg-green-900 text-green-300',
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};