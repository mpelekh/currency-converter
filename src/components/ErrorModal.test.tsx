import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ErrorModal from "./ErrorModal";

describe("ErrorModal component", () => {
  test("should be shown with error message", () => {
    render(<ErrorModal message="Something went wrong" />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  test("should be closed when user clicks the Close button", async () => {
    render(<ErrorModal message="Something went wrong" />);

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() =>
      expect(() => screen.getByTestId("error-modal")).toThrow(
        "Unable to find an element"
      )
    );
  });
});
