import React from "react";

const AccountSummary = ({ profile }) => {

  const accounts = profile?.accounts;

  // Total Income
  const totalIncome = accounts
    ?.flatMap(account => account?.transactions ?? [])
    .filter(transaction => transaction?.transactionType === "Income")
    .reduce((acc, cur) => acc + parseFloat(cur?.amount || 0), 0);

  // Total Expenses
  const totalExpenses = accounts
    ?.flatMap(account => account?.transactions ?? [])
    .filter(transaction => transaction?.transactionType === "Expenses")
    .reduce((acc, cur) => acc + parseFloat(cur?.amount || 0), 0);


  return (
    <React.Fragment>
      {profile?.accounts?.length <= 0 ? <h2 className="text-center text-3xl text-red-600 mt-5 text-lg">No Account Summary Found</h2> : <section className="py-20">
        <h1 className="text-3xl font-bold text-center mb-5 text-indigo-600">Account Summary - for {profile?.accounts?.length} Accounts</h1>
        <div className="container mx-auto px-4">
          <div className="py-4 flex flex-wrap items-center text-center rounded-lg border">
            <div className="py-4 w-full md:w-1/2 lg:w-1/4 border-b md:border-b-0 lg:border-r">
              <h4 className="mb-2 text-gray-500">Total Income</h4>
              <span className="text-3xl lg:text-4xl text-green-600 font-bold">$ {totalIncome}</span>
            </div>
            <div className="py-4 w-full md:w-1/2 lg:w-1/4 border-b md:border-b-0 lg:border-r">
              <h4 className="mb-2 text-gray-500">Total Expenses</h4>
              <span className="text-3xl lg:text-4xl text-red-600 font-bold">$ {totalExpenses}</span>
            </div>
            <div className="py-4 w-full md:w-1/2 lg:w-1/4 border-b md:border-b-0 lg:border-r">
              <h4 className="mb-2 text-gray-500">Total Balance</h4>
              <span className="text-3xl lg:text-4xl text-indigo-600 font-bold">$ {totalIncome - totalExpenses}</span>
            </div>
            <div className="py-4 w-full md:w-1/2 lg:w-1/4">
              <h4 className="mb-2 text-gray-500">Total Transaction</h4>
              <span className="text-3xl lg:text-4xl font-bold"> {accounts?.length}</span>
            </div>
          </div>
        </div>
      </section>}
    </React.Fragment>
  );
};

export default AccountSummary;
