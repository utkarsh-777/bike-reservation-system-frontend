import { fireEvent, render, screen } from "@testing-library/react";
import LoginPage from "../LoginPage";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../../../../reducers/combineReducers";
import { ToastContainer } from "react-toastify";

import { BrowserRouter as Router } from "react-router-dom";

const store = createStore(rootReducer);

const MockLoginPage = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <LoginPage />
      </Router>
    </Provider>
  );
};

describe("Login Page", () => {
  it("Login elements length test", () => {
    render(<MockLoginPage />);
    const LoginElements = screen.getAllByText("Login");
    expect(LoginElements).toHaveLength(2);
  });

  it("Login funtionality check for not providing all details", async () => {
    render(<MockLoginPage />);
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Login" });
    fireEvent.click(EmailInputElement);
    fireEvent.change(EmailInputElement, {
      target: { value: "" },
    });
    fireEvent.click(PasswordInputElement);
    fireEvent.change(PasswordInputElement, { target: { value: "12345" } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText("Fill All Details!");
    expect(toastElement).toHaveLength(2);
  });

  it("Login funtionality check for invalid email", async () => {
    render(<MockLoginPage />);
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Login" });
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

  it("Login funtionality check for not existing user", async () => {
    render(<MockLoginPage />);
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Login" });
    fireEvent.click(EmailInputElement);
    fireEvent.change(EmailInputElement, { target: { value: "abc@g.com" } });
    fireEvent.click(PasswordInputElement);
    fireEvent.change(PasswordInputElement, { target: { value: "12345" } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText(
      "User does not exist, kindly signup first!",
    );
    expect(toastElement).toHaveLength(2);
  });

  it("Login funtionality check for existing user", async () => {
    render(<MockLoginPage />);
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Login" });
    fireEvent.click(EmailInputElement);
    fireEvent.change(EmailInputElement, {
      target: { value: "kumarutkarsh305@gmail.com" },
    });
    fireEvent.click(PasswordInputElement);
    fireEvent.change(PasswordInputElement, { target: { value: "12345" } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText("Login successfull!");
    expect(toastElement).toHaveLength(2);
  });

  it("Login funtionality check for incorrect password", async () => {
    render(<MockLoginPage />);
    const EmailInputElement = screen.getByPlaceholderText(
      "Enter a valid email address",
    );
    const PasswordInputElement = screen.getByPlaceholderText("Enter password");
    const buttonElement = screen.getByRole("button", { name: "Login" });
    fireEvent.click(EmailInputElement);
    fireEvent.change(EmailInputElement, {
      target: { value: "kumarutkarsh305@gmail.com" },
    });
    fireEvent.click(PasswordInputElement);
    fireEvent.change(PasswordInputElement, { target: { value: "123456" } });
    fireEvent.click(buttonElement);
    const toastElement = await screen.findAllByText(
      "Email or Password does not match!",
    );
    expect(toastElement).toHaveLength(2);
  });
});
