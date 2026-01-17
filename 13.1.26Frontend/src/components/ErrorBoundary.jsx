import React from 'react';
import Observability from '../utils/Observability';

/**
 * Global Error Boundary
 * Prevents the whole app from crashing if a child component fails.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Report the crash to our backend!
        Observability.reportError({
            message: error.message,
            stack: errorInfo.componentStack,
            component: 'ErrorBoundary'
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container text-center py-5 mt-5">
                    <div className="card shadow-sm border-0 p-5">
                        <i className="bi bi-exclamation-triangle-fill text-warning display-1 mb-4"></i>
                        <h2 className="fw-bold">Something went wrong</h2>
                        <p className="text-muted">An unexpected error occurred. Don't worry, our team has been notified.</p>
                        <div className="mt-4">
                            <button
                                className="btn btn-dark px-4 py-2 fw-bold text-uppercase"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
