import * as React from "react";
import AccountList from "./AccountList";
import AccountSummary from "./AccountSummary";
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "./../../redux/userSlice"

const MainDashBoard = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getProfileAction())
  }, [dispatch]);

  const { profile, error, loading } = useSelector(state => state?.usersData)
  return (
    <React.Fragment>
      {loading ? <h2 className="text-center text-green-600 mt-5 text-lg">Loading...</h2> : error ? <h2 className="text-center text-red-600 mt-5 text-lg">{error}</h2> : <React.Fragment>
        <AccountSummary profile={profile} />
        <AccountList profile={profile} />
      </React.Fragment>}
    </React.Fragment>
  );
};

export default MainDashBoard;
