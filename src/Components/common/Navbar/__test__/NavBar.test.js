import { render, screen } from "@testing-library/react";
import NavBar from "../NavBar";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../../../../reducers/combineReducers";

import { BrowserRouter as Router } from "react-router-dom";

const store = createStore(rootReducer);

const MockNavBar = ({ user }) => {
  return (
    <Provider store={store}>
      <Router>
        <NavBar user={user} />
      </Router>
    </Provider>
  );
};

describe("NavBar", () => {
  it("should render user name when the userState prop is passed in to Navbar", () => {
    const userObj = {
      email: "kumarutkarsh305@gmail.com",
      fullName: "Utkarsh Kashyap",
      id: 1,
    };
    render(<MockNavBar user={userObj} />);
    const paragraphElement = screen.getByText("Utkarsh Kashyap");
    expect(paragraphElement).toBeInTheDocument();
  });

  it("should render user name visible to user when the userState prop is passed in to Navbar", () => {
    const userObj = {
      email: "kumarutkarsh305@gmail.com",
      fullName: "Utkarsh Kashyap",
      id: 1,
    };
    render(<MockNavBar user={userObj} />);
    const paragraphElement = screen.getByText("Utkarsh Kashyap");
    expect(paragraphElement).toBeVisible();
  });
});
