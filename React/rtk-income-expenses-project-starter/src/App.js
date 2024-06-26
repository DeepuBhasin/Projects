import Home from "./components/HomePage/Home";
import Register from "./components/Forms/Register";
import MainDashBoard from "./components/Dashboard/MainDashBoard";
import AccountDetails from "./components/Dashboard/AccountDetails";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddTransaction from "./components/Forms/AddTransaction";
import EditTransaction from "./components/Forms/EditTransaction";
import AddAccount from "./components/Forms/AddAccount";
import EditAccount from "./components/Forms/EditAccount";
import Login from "./components/Forms/Login";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthRoute } from "./components/AuthRoute/AuthRoute"

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<AuthRoute><MainDashBoard /></AuthRoute>} />
          <Route path="/account" element={<AccountDetails />} />
          <Route path="/account/:id" element={<AccountDetails />} />
          <Route path="/add-transaction/:id" element={<AddTransaction />} />
          <Route path="/edit-transaction/:id" element={<EditTransaction />} />
          <Route path="/add-account" element={<AuthRoute><AddAccount /></AuthRoute>} />
          <Route path="/edit-account/:id" element={<EditAccount />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
