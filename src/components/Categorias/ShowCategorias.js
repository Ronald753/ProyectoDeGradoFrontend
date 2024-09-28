import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../utils/functions';
import { 
    getCategorias, 
    getCategoriasDesactives, 
    postCategoria, 
    updateCategoria, 
    changeCategoriaState 
} from '../../services/categoriasService';
import './ShowCategorias.css';

const ShowCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [categoriasDesactivadas, setCategoriasDesactivadas] = useState([]);
    const [id_categoria, setId_categoria] = useState('');
    const [nombre_categoria, setNombre_categoria] = useState('');
    const [operation, setOperation] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetchCategorias();
        fetchCategoriasDesactivadas();
    }, []);

    const fetchCategorias = async () => {
        const respuesta = await getCategorias();
        setCategorias(respuesta.data);
    };

    const fetchCategoriasDesactivadas = async () => {
        const respuesta = await getCategoriasDesactives();
        setCategoriasDesactivadas(respuesta.data);
    };

    const openModal = (op, id_categoria, nombre_categoria) => {
        setId_categoria('');
        setNombre_categoria('');
        setOperation(op);
        setTitle(op === 1 ? 'Registrar Categoria' : 'Editar Categoria');
        if (op === 2) {
            setId_categoria(id_categoria);
            setNombre_categoria(nombre_categoria);
        }
        setTimeout(() => {
            document.getElementById('nombre').focus();
        }, 500);
    };

    const validar = () => {
        if (nombre_categoria.trim() === '') {
            show_alerta('Escribe el nombre de la categoria', 'warning');
        } else {
            const parametros = { nombre_categoria: nombre_categoria.trim() };
            const metodo = operation === 1 ? 'POST' : 'PUT';
            enviarSolicitud(metodo, parametros);
        }
    };

    const enviarSolicitud = async (metodo, parametros) => {
        try {
            let respuesta;
            if (metodo === 'POST') {
                respuesta = await postCategoria(parametros);
            } else {
                respuesta = await updateCategoria(id_categoria, parametros);
            }
            show_alerta('Hecho', 'success');
            document.getElementById('btnCerrar').click();
            fetchCategorias();
            fetchCategoriasDesactivadas();
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.log(error);
        }
    };

    const changeState = (id_categoria, nombre_categoria, estado) => {
        const MySwal = withReactContent(Swal);
        const action = estado ? 'desactivar' : 'activar';
        MySwal.fire({
            title: `¿Seguro de ${action} la categoría ${nombre_categoria}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                changeCategoriaState(id_categoria, !estado)
                    .then(() => {
                        show_alerta(`Categoría ${estado ? 'desactivada' : 'activada'} con éxito`, 'success');
                        fetchCategorias();
                        fetchCategoriasDesactivadas();
                    })
                    .catch(() => {
                        show_alerta('Error al cambiar el estado de la categoría', 'error');
                    });
            } else {
                show_alerta("La categoría no fue cambiada", "info");
            }
        });
    };

    return (
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-12 col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button 
                            onClick={() => openModal(1)} 
                            className='btn btn-dark' 
                            data-bs-toggle='modal' 
                            data-bs-target='#modalCategorias'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir
                        </button>
                    </div>
                </div>
            </div>

            <div className='row mt-4'>
                <div className='col-12 col-lg-10 offset-lg-1'>
                    <h4>Categorías Activas</h4>
                    <div className='table-responsive'>
                        <table className='table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Categoria</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map((categoria, i) => (
                                    <tr key={categoria.id_categoria}>
                                        <td>{(i + 1)}</td>
                                        <td>{categoria.nombre_categoria}</td>
                                        <td>{categoria.estado ? 'Activo' : 'Desactivado'}</td>
                                        <td>
                                            <button 
                                                onClick={() => openModal(2, categoria.id_categoria, categoria.nombre_categoria)} 
                                                className='btn btn-warning' 
                                                data-bs-toggle='modal' 
                                                data-bs-target='#modalCategorias'>
                                                <i className='fa-solid fa-edit'></i> Editar
                                            </button>
                                            &nbsp;
                                            <button 
                                                onClick={() => changeState(categoria.id_categoria, categoria.nombre_categoria, categoria.estado)} 
                                                className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i> {categoria.estado ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='col-12 col-lg-10 offset-lg-1 mt-4'>
                    <h4>Categorías Desactivadas</h4>
                    <div className='table-responsive'>
                        <table className='table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Categoria</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriasDesactivadas.map((categoria, i) => (
                                    <tr key={categoria.id_categoria}>
                                        <td>{(i + 1)}</td>
                                        <td>{categoria.nombre_categoria}</td>
                                        <td>{categoria.estado ? 'Activo' : 'Desactivado'}</td>
                                        <td>
                                            <button 
                                                onClick={() => changeState(categoria.id_categoria, categoria.nombre_categoria, categoria.estado)} 
                                                className='btn btn-success'>
                                                <i className='fa-solid fa-check'></i> {categoria.estado ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div id='modalCategorias' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title'>{title}</h5>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input 
                                    type='text' 
                                    id='nombre' 
                                    className='form-control' 
                                    placeholder='Nombre de la categoria'
                                    value={nombre_categoria} 
                                    onChange={(e) => setNombre_categoria(e.target.value)} 
                                />
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button 
                                    onClick={validar} 
                                    className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button 
                                type='button' 
                                id='btnCerrar' 
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

export default ShowCategorias;
