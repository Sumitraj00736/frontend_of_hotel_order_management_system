import React from 'react';
import TransactionHistoryTable from '../../../dashboard/common/TransactionHistoryTable.jsx';

const FinanceTransactionHistory = ({ loading, ...props }) => {
  if (loading) return <div className="fd-empty">Loading transaction history...</div>;
  return <TransactionHistoryTable {...props} />;
};

export default FinanceTransactionHistory;
