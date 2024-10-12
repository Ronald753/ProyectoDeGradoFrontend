import axios from 'axios';

const baseUrl = 'http://192.168.0.20:8000/orders/pedidos/';

export const getPedidos = async () => {
    return axios.get(`${baseUrl}activepedidos/`);
};

export const updatePedidoEstado = async (id, estado_pedido) => {
    return axios.put(`${baseUrl}update_estado/${id}/`, estado_pedido);
};
