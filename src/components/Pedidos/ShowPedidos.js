import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../utils/functions'; // Asegúrate de tener esta función disponible
import { getPedidos, updatePedidoEstado } from '../../services/pedidosService'; // Asegúrate de importar la función de actualización
import './ShowPedidos.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

const estadosPedido = ['recibido', 'preparando', 'terminado'];

const ShowPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        fetchPedidos();
    }, []);

    const fetchPedidos = async () => {
        try {
            const respuesta = await getPedidos();
            setPedidos(respuesta.data);
        } catch (error) {
            show_alerta('Error al obtener los pedidos', 'error');
            console.log(error);
        }
    };

    const changeEstadoPedido = async (pedido) => {
        const MySwal = withReactContent(Swal);
        
        // Si el estado actual es "terminado", no se permite cambiarlo
        if (pedido.estado_pedido === 'terminado') {
            show_alerta('El pedido ya está terminado y no se puede cambiar el estado.', 'info');
            return;
        }

        const currentIndex = estadosPedido.indexOf(pedido.estado_pedido);
        const nextIndex = (currentIndex + 1) % estadosPedido.length; // Cambia al siguiente estado
        const nuevoEstado = estadosPedido[nextIndex];

        MySwal.fire({
            title: `¿Seguro que quieres cambiar el estado del pedido ${pedido.id_pedido} a "${nuevoEstado}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, cambiar a "${nuevoEstado}"`,
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updatePedidoEstado(pedido.id_pedido, { estado_pedido: nuevoEstado });
                    show_alerta(`Estado del pedido cambiado a "${nuevoEstado}" con éxito`, 'success');
                    fetchPedidos(); // Refrescar la lista de pedidos
                } catch (error) {
                    show_alerta('Error al cambiar el estado del pedido', 'error');
                    console.log(error);
                }
            } else {
                show_alerta("El estado del pedido no fue cambiado", "info");
            }
        });
    };

    return (
        <div className='container-fluid'>
            <div className='row mt-4'>
                <div className='col-12'>
                    <h4>Lista de Pedidos</h4>
                    <div className='table-responsive-lg'>
                        <table className='table table-hover table-striped table-bordered'>
                            <thead className='table-dark'>
                                <tr>
                                    <th>#</th>
                                    <th>ID Pedido</th>
                                    <th>Usuario</th>
                                    <th>Fecha Pedido</th>
                                    <th>Tipo Pedido</th>
                                    <th>Total</th>
                                    <th>Estado Actual</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {pedidos.map((pedido, i) => (
                                    <tr key={pedido.id_pedido}>
                                        <td>{(i + 1)}</td>
                                        <td>{pedido.id_pedido}</td>
                                        <td>{pedido.id_usuario}</td>
                                        <td>{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                                        <td>{pedido.tipo_pedido}</td>
                                        <td>{pedido.total}</td>
                                        <td>
                                            <span className={`badge ${pedido.estado_pedido === 'terminado' ? 'bg-success' : 'bg-warning'}`}>
                                                {pedido.estado_pedido}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => changeEstadoPedido(pedido)} 
                                                className='btn btn-primary'
                                                disabled={pedido.estado_pedido === 'terminado'} // Desactiva el botón si el estado es "terminado"
                                            >
                                                Cambiar Estado
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowPedidos;
