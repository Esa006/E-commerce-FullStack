import axiosClient from "./axiosClient";

const addressApi = {
    getAddresses: () => axiosClient.get("/addresses"),
    addAddress: (data) => axiosClient.post("/addresses", data),
    updateAddress: (id, data) => axiosClient.put(`/addresses/${id}`, data),
    deleteAddress: (id) => axiosClient.delete(`/addresses/${id}`),
    setDefaultAddress: (id) => axiosClient.put(`/addresses/${id}/default`),
};

export default addressApi;
