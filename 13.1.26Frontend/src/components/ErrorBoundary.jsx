import React from 'react';
import Observability from '../utils/Observability';

/**
 * Production-grade Error Boundary
 * Prevents the entire React tree from crashing when a component fails.
 * Reports crashes to the Observability service.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to our observability service
        Observability.reportError({
            message: error.toString(),
            stack: error.stack + '\nComponent Stack: ' + errorInfo.componentStack,
            component: 'React ErrorBoundary'
        });
    }

    render() {
        if (this.state.hasError) {
            // High-quality fallback UI
            return (
                <div className="container py-5 mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="p-5 border rounded shadow-sm bg-white">
                                <i className="bi bi-exclamation-triangle text-danger display-1 mb-4"></i>
                                <h2 className="fw-bold mb-3">Something went wrong</h2>
                                <p className="text-muted mb-4">
                                    We've encountered an unexpected error. Our team has been notified automatically.
                                </p>
                                <button
                                    className="btn btn-dark rounded-0 px-4 py-2 text-uppercase fw-bold"
                                    onClick={() => window.location.reload()}
                                >
                                    Reload Page
                                </button>
                                <div className="mt-4 pt-4 border-top">
                                    <a href="/" className="text-decoration-none text-dark small fw-bold">
                                        <i className="bi bi-arrow-left me-2"></i>Back to Home
                                    </a>
                                </div>
                            </div>
                            <p className="mt-3 text-muted x-small">
                                Error ID: {new Date().getTime().toString(36)}
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
