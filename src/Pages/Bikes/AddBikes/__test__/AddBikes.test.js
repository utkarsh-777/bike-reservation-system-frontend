import { fireEvent, render, screen } from "@testing-library/react";
import AddBikes from "../AddBikes";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../../../../reducers/combineReducers";
import { ToastContainer } from "react-toastify";

import { BrowserRouter as Router } from "react-router-dom";

const store = createStore(rootReducer);

const MockAddBikes = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <AddBikes />
      </Router>
    </Provider>
  );
};

describe("Add Bikes Page", () => {
  it("Add Bikes funtionality check for not providing all details", async () => {
    render(<MockAddBikes />, {});
    const modelInputElement = screen.getByTitle("input1");
    const colourInputElement = screen.getByTitle("input2");
    const locationInputElement = screen.getByTitle("input3");
    const availabilityInputElement = screen.getByTitle("input4");
    const buttonElement = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(modelInputElement);
    fireEvent.change(modelInputElement, { target: { value: "" } });
    fireEvent.click(colourInputElement);
    fireEvent.change(colourInputElement, { target: { value: "" } });
    fireEvent.click(locationInputElement);
    fireEvent.change(locationInputElement, { target: { value: "" } });
    fireEvent.click(availabilityInputElement);
    fireEvent.change(availabilityInputElement, { target: { value: false } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText("Enter all fields!");
    expect(toastElement).toHaveLength(3);
  });

//   it("Add Bikes funtionality check for providing all details", async () => {
//     render(<MockAddBikes />);
//     const modelInputElement = screen.getByTitle("input1");
//     const colourInputElement = screen.getByTitle("input2");
//     const locationInputElement = screen.getByTitle("input3");
//     const availabilityInputElement = screen.getByTitle("input4");
//     const buttonElement = screen.getByRole("button", { name: "Submit" });
//     fireEvent.click(modelInputElement);
//     fireEvent.change(modelInputElement, { target: { value: "model7" } });
//     fireEvent.click(colourInputElement);
//     fireEvent.change(colourInputElement, { target: { value: "green" } });
//     fireEvent.click(locationInputElement);
//     fireEvent.change(locationInputElement, { target: { value: "bangalore" } });
//     fireEvent.click(availabilityInputElement);
//     fireEvent.change(availabilityInputElement, { target: { value: false } });
//     fireEvent.click(buttonElement);
//     const toastElement = await screen.findAllByText("Enter all fields!");
//     console.log(toastElement);
//     expect(toastElement).toHaveLength(3);
//   });
});
