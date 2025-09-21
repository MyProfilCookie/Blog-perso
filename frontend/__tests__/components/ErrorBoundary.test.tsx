import React from "react";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../../components/ErrorBoundary";

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

// Mock console.error and console.log to avoid noise in tests
beforeAll(() => {
  // console.error = jest.fn();
  // console.log = jest.fn();
});

afterAll(() => {
  // console.error = originalError;
  // console.log = originalLog;
});

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("should render error UI when there is an error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText(/Oups ! Une erreur s'est produite/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Recharger la page/)).toBeInTheDocument();
  });

  it("should display custom error message when provided", () => {
    const customMessage = "Custom error message";

    render(
      <ErrorBoundary fallback={<div>{customMessage}</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("should log error to console", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Erreur capturée par ErrorBoundary:",
      expect.any(Error),
      expect.any(Object),
    );

    consoleSpy.mockRestore();
  });

  it("should call onError callback when provided", () => {
    const onErrorMock = jest.fn();

    render(
      <ErrorBoundary onError={onErrorMock}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(onErrorMock).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object),
    );
  });

  it("should reset error state when children change", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText(/Oups ! Une erreur s'est produite/),
    ).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("should handle multiple errors gracefully", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText(/Oups ! Une erreur s'est produite/),
    ).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText(/Oups ! Une erreur s'est produite/),
    ).toBeInTheDocument();

    // Test recovery after error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText(/Oups ! Une erreur s'est produite/),
    ).toBeInTheDocument();

    // Test that it can recover
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("should provide retry functionality", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText(/Oups ! Une erreur s'est produite/),
    ).toBeInTheDocument();

    const retryButton = screen.getByText(/Recharger la page/);
    expect(retryButton).toBeInTheDocument();

    // Simulate retry by changing props
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });
});
