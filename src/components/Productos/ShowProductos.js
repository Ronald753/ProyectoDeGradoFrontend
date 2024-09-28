import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../utils/functions';
import {
  getProductos,
  getProductosDesactives, // Asegúrate de importar esta función
  changeProductoState,
  updateProducto,
} from '../../services/productosService'; // Ajusta los servicios según tu proyecto
import './ShowProductos.css'; // Importa el archivo CSS para estilos

const ShowProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productosDesactivados, setProductosDesactivados] = useState([]);
    const [id_producto, setId_producto] = useState('');
    const [nombre_producto, setNombre_producto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetchProductos();
        fetchProductosDesactivados(); // Llama a la función para obtener productos desactivados
    }, []);

    const fetchProductos = async () => {
        const respuesta = await getProductos();
        setProductos(respuesta.data); // Guarda los productos activos
    };

    const fetchProductosDesactivados = async () => {
        const respuesta = await getProductosDesactives();
        setProductosDesactivados(respuesta.data); // Guarda los productos desactivados
    };

    const openModal = (id_producto, nombre_producto, descripcion, precio) => {
        setId_producto(id_producto);
        setNombre_producto(nombre_producto);
        setDescripcion(descripcion);
        setPrecio(precio);
        setTitle('Editar Producto');
    };

    const handleUpdate = async () => {
        // Lógica para actualizar el producto
        try {
            await updateProducto(id_producto, {
                nombre_producto,
                descripcion,
                precio,
            });
            show_alerta('Producto actualizado con éxito', 'success');
            fetchProductos(); // Actualiza la lista de productos
            fetchProductosDesactivados(); // Actualiza la lista de productos desactivados
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
                        fetchProductos(); // Actualiza la lista de productos
                        fetchProductosDesactivados(); // Actualiza la lista de productos desactivados
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
                                                    onClick={() =>
                                                        openModal(
                                                            producto.id_producto,
                                                            producto.nombre_producto,
                                                            producto.descripcion,
                                                            producto.precio
                                                        )
                                                    }
                                                    className='btn btn-warning'
                                                    data-bs-toggle='modal'
                                                    data-bs-target='#modalProductos'>
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

            {/* Modal para editar productos */}
            <div id='modalProductos' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5>{title}</h5>
                            <button
                                type='button'
                                className='btn-close'
                                data-bs-dismiss='modal'
                                aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            {/* Campos para editar productos */}
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>
                                    <i className='fa-solid fa-burger'></i>
                                </span>
                                <input
                                    type='text'
                                    id='nombre'
                                    className='form-control'
                                    placeholder='Nombre del producto'
                                    value={nombre_producto}
                                    onChange={(e) => setNombre_producto(e.target.value)}
                                />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>
                                    <i className='fa-solid fa-info-circle'></i>
                                </span>
                                <input
                                    type='text'
                                    id='descripcion'
                                    className='form-control'
                                    placeholder='Descripción del producto'
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'>
                                    <i className='fa-solid fa-dollar-sign'></i>
                                </span>
                                <input
                                    type='number'
                                    id='precio'
                                    className='form-control'
                                    placeholder='Precio'
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                />
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button
                                    id='btnActualizar'
                                    className='btn btn-primary'
                                    onClick={handleUpdate} // Maneja la actualización
                                >
                                    Actualizar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button
                                type='button'
                                className='btn btn-secondary'
                                data-bs-dismiss='modal'>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowProductos;
