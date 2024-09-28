// menuService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/products/menu/'; // Ajusta esto según sea necesario

export const getMenus = async () => {
    return await axios.get(`${API_URL}menus/`);
};

export const getMenuById = async (id) => {
    return await axios.get(`${API_URL}menus/${id}/`);
};

export const updateMenu = async (id_menu, updatedMenu) => {
    const response = await axios.put(`${API_URL}menus/${id_menu}/update/`, updatedMenu);
    return response;
};

export const addProductToMenu = async (data) => {
    return await axios.post(`${API_URL}menu-producto/`, data);
};

export const removeProductFromMenu = async (id) => {
    return await axios.delete(`${API_URL}menu-producto/${id}/`);
};
