import axios from 'axios';

const baseUrl = 'http://192.168.0.20:8000/products/categorias/';

export const getCategorias = async () => {
    return axios.get(`${baseUrl}actives/`);
};

export const getCategoriasDesactives = async () => {
    return axios.get(`${baseUrl}desactives/`);
};

export const postCategoria = async (categoria) => {
    return axios.post(`${baseUrl}add/`, categoria);
};

export const updateCategoria = async (id, categoria) => {
    return axios.put(`${baseUrl}update/${id}/`, categoria);
};

// Cambiar el estado de la categoría a desactivado
export const changeCategoriaState = async (id, estado) => {
    return axios.put(`${baseUrl}update_state/${id}/`, { estado });
};
