import axios from 'axios';

/**
 * Production Observability Utility
 * Manages global error capturing and reporting to the backend.
 */
const Observability = {
    /**
     * Report an error to the backend reporting endpoint.
     * Uses asynchronous beacon or fetch to avoid blocking the UI.
     */
    reportError: async (errorData) => {
        try {
            const payload = {
                message: errorData.message || 'Unknown Error',
                stack: errorData.stack || null,
                component: errorData.component || 'Global',
                vitals: errorData.vitals || null,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };

            const API_BASE_URL = 'http://localhost:8000/api'; 
            await axios.post(`${API_BASE_URL}/error-report`, payload);
        } catch (reportingError) {
            console.error('Failed to send error report:', reportingError);
        }
    },

    /**
     * Report performance metrics (like page load time)
     */
    reportPerformance: async (name, value, unit = 'ms') => {
        return Observability.reportError({
            message: `Performance Benchmark: ${name} = ${value}${unit}`,
            component: 'Performance Tracker',
            vitals: { name, value, unit }
        });
    },

    /**
     * Initialize global listeners for runtime errors and promise rejections.
     */
    init: () => {
        // 1. Capture Global Runtime Errors
        window.onerror = (message, source, lineno, colno, error) => {
            Observability.reportError({
                message: `${message} at ${source}:${lineno}:${colno}`,
                stack: error?.stack,
                component: 'Global window.onerror'
            });
            // Let the browser handle the error as usual (don't return true)
            return false;
        };

        // 2. Capture Unhandled Promise Rejections (Async/Await errors)
        window.onunhandledrejection = (event) => {
            Observability.reportError({
                message: `Unhandled Rejection: ${event.reason?.message || event.reason}`,
                stack: event.reason?.stack,
                component: 'Global Promise Rejection'
            });
        };

        // 3. Captures Core Web Vitals (Production Performance Monitoring)
        // We report performance if LCP (Largest Contentful Paint) is poor (> 2.5s)
        if ('target' in PerformanceObserver.prototype) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        // We only care about LCP for this simplified production monitor
                        if (entry.entryType === 'largest-contentful-paint') {
                            const lcpValue = entry.startTime / 1000; // convert to seconds
                            if (lcpValue > 2.5) {
                                Observability.reportError({
                                    message: `Poor LCP detected: ${lcpValue.toFixed(2)}s`,
                                    component: 'Performance Monitoring',
                                    vitals: { LCP: lcpValue, type: entry.entryType }
                                });
                            }
                        }
                    }
                });
                observer.observe({ type: 'largest-contentful-paint', buffered: true });
            } catch (e) {
                console.warn('PerformanceObserver not supported for LCP');
            }
        }

        console.log('Production Observability Initialized.');
    }
};

export default Observability;
