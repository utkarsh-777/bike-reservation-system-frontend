import { fireEvent, render, screen } from "@testing-library/react";
import SignupPage from "../SignupPage";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../../../../reducers/combineReducers";
import { ToastContainer } from "react-toastify";

import { BrowserRouter as Router } from "react-router-dom";

const store = createStore(rootReducer);

const MockSignupPage = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <SignupPage />
      </Router>
    </Provider>
  );
};

describe("Signup Page", () => {
  it("Login elements length test", () => {
    render(<MockSignupPage />);
    const LoginElements = screen.getAllByText("Signup");
    expect(LoginElements).toHaveLength(2);
  });

  it("Signup funtionality check for not providing all details", async () => {
    render(<MockSignupPage />);
    const NameInputElement = screen.getByPlaceholderText("Enter Name");
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Signup" });
    fireEvent.click(NameInputElement);
    fireEvent.change(NameInputElement, {
      target: { value: "" },
    });
    fireEvent.click(EmailInputElement);
    fireEvent.change(EmailInputElement, {
      target: { value: "abcd" },
    });
    fireEvent.click(PasswordInputElement);
    fireEvent.change(PasswordInputElement, { target: { value: "12345" } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText("Fill All Details!");
    expect(toastElement).toHaveLength(2);
  });

  it("Signup funtionality check for invalid email", async () => {
    render(<MockSignupPage />);
    const NameInputElement = screen.getByPlaceholderText("Enter Name");
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Signup" });
    fireEvent.click(NameInputElement);
    fireEvent.change(NameInputElement, {
      target: { value: "Utkarsh Kashyap" },
    });
    fireEvent.click(EmailInputElement);
    fireEvent.change(EmailInputElement, {
      target: { value: "abcd" },
    });
    fireEvent.click(PasswordInputElement);
    fireEvent.change(PasswordInputElement, { target: { value: "12345" } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText("Email is not valid");
    expect(toastElement).toHaveLength(2);
  });

  it("Signup funtionality check for invalid password", async () => {
    render(<MockSignupPage />);
    const NameInputElement = screen.getByPlaceholderText("Enter Name");
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Signup" });
    fireEvent.click(NameInputElement);
    fireEvent.change(NameInputElement, {
      target: { value: "Utkarsh Kashyap" },
    });
    fireEvent.click(EmailInputElement);
    fireEvent.change(EmailInputElement, {
      target: { value: "abc@g.com" },
    });
    fireEvent.click(PasswordInputElement);
    fireEvent.change(PasswordInputElement, { target: { value: "12345 6" } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText(
      "Password is not valid! (Spaces not allowed and Minimun length should be 4)",
    );
    expect(toastElement).toHaveLength(2);
  });

  it("Signup funtionality check for existing user", async () => {
    render(<MockSignupPage />);
    const NameInputElement = screen.getByPlaceholderText("Enter Name");
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Signup" });
    fireEvent.click(NameInputElement);
    fireEvent.change(NameInputElement, {
      target: { value: "Utkarsh Kashyap" },
    });
    fireEvent.click(EmailInputElement);
    fireEvent.change(EmailInputElement, {
      target: { value: "kumarutkarsh305@gmail.com" },
    });
    fireEvent.click(PasswordInputElement);
    fireEvent.change(PasswordInputElement, { target: { value: "12345" } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText(
      "User already exists, kindly login!",
    );
    expect(toastElement).toHaveLength(2);
  });

  //   it("Signup funtionality check for new user", async () => {
  //     render(<MockSignupPage />);
  //     const NameInputElement = screen.getByPlaceholderText("Enter Name");
  //     const EmailInputElement = screen.getByPlaceholderText(
  //       "Enter a valid email address",
  //     );
  //     const PasswordInputElement = screen.getByPlaceholderText("Enter password");
  //     const buttonElement = screen.getByRole("button", { name: "Signup" });
  //     fireEvent.click(NameInputElement);
  //     fireEvent.change(NameInputElement, {
  //       target: { value: "test" },
  //     });
  //     fireEvent.click(EmailInputElement);
  //     fireEvent.change(EmailInputElement, {
  //       target: { value: "test@gmail.com" },
  //     });
  //     fireEvent.click(PasswordInputElement);
  //     fireEvent.change(PasswordInputElement, { target: { value: "12345" } });
  //     fireEvent.click(buttonElement);
  //     const toastElement = await screen.findAllByText("Signup successfull!");
  //     expect(toastElement).toHaveLength(2);
  //   });
});
