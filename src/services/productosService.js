import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/products/productos/';

export const getProductos = async () => {
    return axios.get(`${baseUrl}actives/`);
};

export const getProductosDesactives = async () => {
    return axios.get(`${baseUrl}desactives/`);
};

export const getProductoById =async (id) => {
    return axios.get(`${baseUrl}${id}/`)
}

export const postProducto = async (categoria) => {
    return axios.post(`${baseUrl}add/`, categoria);
};

export const updateProducto = async (id, categoria) => {
    return axios.put(`${baseUrl}update/${id}/`, categoria);
};

export const changeProductoState = async (id, estado) => {
    return axios.put(`${baseUrl}update_state/${id}/`, { estado });
};
