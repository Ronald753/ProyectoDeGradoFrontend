import axios from 'axios';

const API_URL = 'http://192.168.0.20:8000/products/ingredientes/';

// Función para obtener todos los ingredientes activos
export const getIngredientes = async () => {
    return await axios.get(`${API_URL}actives/`);
};

// Función para obtener todos los ingredientes desactivados
export const getIngredientesDesactives = async () => {
    return await axios.get(`${API_URL}desactives/`);
};

// Función para crear un nuevo ingrediente
export const postIngrediente = async (ingrediente) => {
    return await axios.post(`${API_URL}add/`, ingrediente);
};

// Función para actualizar un ingrediente existente
export const updateIngrediente = async (id_ingrediente, ingrediente) => {
    return await axios.put(`${API_URL}update/${id_ingrediente}/`, ingrediente);
};

// Función para cambiar el estado de un ingrediente
export const changeIngredienteState = async (id_ingrediente, estado) => {
    return await axios.put(`${API_URL}update_state/${id_ingrediente}/`, { estado });
};



