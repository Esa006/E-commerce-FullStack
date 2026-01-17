import axiosClient from './axiosClient';

/**
 * apiClient is now an alias for the robust axiosClient
 * ensuring a single source of truth for all API calls.
 */
const apiClient = axiosClient;

export default apiClient;
