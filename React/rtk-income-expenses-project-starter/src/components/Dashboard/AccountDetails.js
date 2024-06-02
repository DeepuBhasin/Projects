import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TransactionList from "./TransactionList";
import { useDispatch, useSelector } from "react-redux";
import { getSingleAccountAction } from "./../../redux/accountSlice"

const AccountDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSingleAccountAction(id));
  }, [dispatch, id]);

  const { account, loading, error } = useSelector((state) => state?.accountData);

  // get sumOfIncome
  const totalIncome = account?.transactions?.filter(
    (transaction) => transaction.transactionType === "Income"
  ).reduce((acc, cur) => parseFloat(acc) + parseFloat(cur.amount), 0);

  // get sumOfIncome
  const totalExpenses = account?.transactions?.filter(
    (transaction) => transaction.transactionType === "Expenses"
  ).reduce((acc, cur) => parseFloat(acc) + parseFloat(cur.amount), 0);


  return (
    <React.Fragment>
      {/* Account Summary */}
      {loading ? <p className="text-center text-green-500">Loading...</p> : error ? <p className="text-center text-red-500">{error}</p> :
        <React.Fragment>
          <section
            className="py-20 xl:pt-24 xl:pb-32 bg-white"
            style={{
              backgroundImage: 'url("flex-ui-assets/elements/pattern-white.svg")',
              backgroundPosition: "center",
            }}
          >
            <div className="container px-4 mx-auto">
              <div className="text-center">
                <span className="inline-block py-px px-2 mb-4 text-xs leading-5 text-green-500 bg-green-100 font-medium uppercase rounded-9xl">
                  Your Initial Balance is: ${account?.initialBalance}
                </span>
                <h3 className="mb-4 text-4xl md:text-5xl text-coolGray-900 font-bold tracking-tighter">
                  {account?.name}
                </h3>
                <p className=" mx-auto mb-8 text-lg md:text-xl text-coolGray-500 font-medium max-w-4xl">
                  {account?.notes}
                </p>
                <Link
                  to={`/edit-account/${account?.id}`}
                  className="inline-flex text-center  mb-8 items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Edit Account
                </Link>
                <div className="flex flex-wrap justify-center -mx-4">
                  <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8 lg:mb-0">
                    <h2 className="mb-2 text-4xl md:text-5xl text-red-600 font-bold tracking-tighter">
                      $ {totalExpenses}

                    </h2>
                    <p className="text-lg md:text-xl text-coolGray-500 font-medium">
                      Expenses
                    </p>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8 lg:mb-0">
                    <h2 className="mb-2 text-4xl md:text-5xl text-coolGray-900 font-bold tracking-tighter">
                      $ {totalIncome}
                    </h2>
                    <p className="text-lg md:text-xl text-green-500 font-medium">
                      Income
                    </p>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-1/4 px-4">
                    <h2 className="mb-2 text-4xl md:text-5xl text-coolGray-900 font-bold tracking-tighter">
                      $ {totalIncome - totalExpenses}
                    </h2>
                    <p className="text-lg md:text-xl text-blue-500 font-medium">
                      Balance
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "2rem",
                  }}
                >
                  <Link
                    to={`/add-transaction/${account?.id}`}
                    type="button"
                    className="inline-flex text-center items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add New Transaction
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {account?.transactions?.length > 0 ? (
            <TransactionList transactions={account?.transactions} />
          ) : (
            <h2 className="text-center text-red-600 mt-5 text-lg">No Transaction Found</h2>
          )}</React.Fragment>}
    </React.Fragment>
  );
};

export default AccountDetails;
