import axios from 'axios';

const baseUrl = 'http://192.168.0.20:8000/clients/usuarios/';

export const getUsuarios = async () => {
    return axios.get(`${baseUrl}actives/`);
};

export const getUsuariosDesactives = async () => {
    return axios.get(`${baseUrl}desactives/`);
};

export const getUsuarioById =async (id) => {
    return axios.get(`${baseUrl}${id}/`)
}

export const postUsuario = async (categoria) => {
    return axios.post(`${baseUrl}add/`, categoria);
};

export const updateUsuario = async (id, categoria) => {
    return axios.put(`${baseUrl}update/${id}/`, categoria);
};

export const changeUsuarioState = async (id, estado) => {
    return axios.put(`${baseUrl}update_state/${id}/`, { estado });
};
