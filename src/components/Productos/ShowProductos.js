import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { show_alerta } from '../../utils/functions';
import {
  getProductos,
  getProductosDesactives,
  changeProductoState,
  updateProducto,
} from '../../services/productosService';
import './ShowProductos.css';

const ShowProductos = () => {
    const navigate = useNavigate(); // Inicializa el hook useNavigate
    const [productos, setProductos] = useState([]);
    const [productosDesactivados, setProductosDesactivados] = useState([]);
    const [id_producto, setId_producto] = useState('');
    const [nombre_producto, setNombre_producto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetchProductos();
        fetchProductosDesactivados();
    }, []);

    const fetchProductos = async () => {
        const respuesta = await getProductos();
        setProductos(respuesta.data);
    };

    const fetchProductosDesactivados = async () => {
        const respuesta = await getProductosDesactives();
        setProductosDesactivados(respuesta.data);
    };

    const handleUpdate = async () => {
        try {
            await updateProducto(id_producto, {
                nombre_producto,
                descripcion,
                precio,
            });
            show_alerta('Producto actualizado con éxito', 'success');
            fetchProductos();
            fetchProductosDesactivados();
        } catch (error) {
            show_alerta('Error al actualizar el producto', 'error');
        }
    };

    const changeState = (id_producto, nombre_producto, estado) => {
        const MySwal = withReactContent(Swal);
        const action = estado ? 'desactivar' : 'activar';
        MySwal.fire({
            title: `¿Seguro de ${action} el producto ${nombre_producto}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                changeProductoState(id_producto, !estado)
                    .then(() => {
                        show_alerta(
                            `Producto ${estado ? 'desactivado' : 'activado'} con éxito`,
                            'success'
                        );
                        fetchProductos();
                        fetchProductosDesactivados();
                    })
                    .catch(() => {
                        show_alerta('Error al cambiar el estado del producto', 'error');
                    });
            } else {
                show_alerta('El producto no fue cambiado', 'info');
            }
        });
    };

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-lg-2'>
                        <h3>Productos Activos</h3>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Producto</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Estado</th>
                                        <th>Ingredientes</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {productos.map((producto, i) => (
                                        <tr key={producto.id_producto}>
                                            <td>{i + 1}</td>
                                            <td>{producto.nombre_producto}</td>
                                            <td>{producto.descripcion}</td>
                                            <td>{producto.precio}</td>
                                            <td>{producto.estado ? 'Activo' : 'Desactivado'}</td>
                                            <td>{producto.ingredientes}</td>
                                            <td>
                                                <button
                                                    onClick={() => navigate(`/productos/editarproducto/${producto.id_producto}`)} // Redirige a EditProducto.js
                                                    className='btn btn-warning'>
                                                    <i className='fa-solid fa-edit'></i> Editar
                                                </button>
                                                &nbsp;
                                                <button
                                                    onClick={() =>
                                                        changeState(
                                                            producto.id_producto,
                                                            producto.nombre_producto,
                                                            producto.estado
                                                        )
                                                    }
                                                    className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i>{' '}
                                                    Desactivar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3>Productos Desactivados</h3>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Producto</th>
                                        <th>Descripción</th>
                                        <th>Precio</th>
                                        <th>Estado</th>
                                        <th>Ingredientes</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {productosDesactivados.map((producto, i) => (
                                        <tr key={producto.id_producto}>
                                            <td>{i + 1}</td>
                                            <td>{producto.nombre_producto}</td>
                                            <td>{producto.descripcion}</td>
                                            <td>{producto.precio}</td>
                                            <td>{producto.estado ? 'Activo' : 'Desactivado'}</td>
                                            <td>{producto.ingredientes}</td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        changeState(
                                                            producto.id_producto,
                                                            producto.nombre_producto,
                                                            producto.estado
                                                        )
                                                    }
                                                    className='btn btn-success'>
                                                    <i className='fa-solid fa-check'></i> Activar
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
        </div>
    );
};

export default ShowProductos;
