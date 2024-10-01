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
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

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
            <div className='row mt-3 justify-content-center'>
                <div className='col-md-4'>
                    <div className='d-grid mx-auto'>
                        <button 
                            onClick={() => openModal(1)} 
                            className='btn btn-dark btn-lg' 
                            data-bs-toggle='modal' 
                            data-bs-target='#modalCategorias'>
                            <i className='fa-solid fa-circle-plus'></i> Añadir Categoria
                        </button>
                    </div>
                </div>
            </div>

            <div className='row mt-4'>
                <div className='col-12'>
                    <h4>Categorías Activas</h4>
                    <div className='table-responsive-lg'>
                        <table className='table table-hover table-striped table-bordered'>
                            <thead className='table-dark'>
                                <tr>
                                    <th>#</th>
                                    <th>Categoria</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {categorias.map((categoria, i) => (
                                    <tr key={categoria.id_categoria}>
                                        <td>{(i + 1)}</td>
                                        <td>{categoria.nombre_categoria}</td>
                                        <td>
                                            <span className={`badge ${categoria.estado ? 'bg-success' : 'bg-danger'}`}>
                                                {categoria.estado ? 'Activo' : 'Desactivado'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => openModal(2, categoria.id_categoria, categoria.nombre_categoria)} 
                                                className='btn btn-warning me-2' 
                                                data-bs-toggle='modal' 
                                                data-bs-target='#modalCategorias'>
                                                <i className='fa-solid fa-edit'></i> Editar
                                            </button>
                                            <button 
                                                onClick={() => changeState(categoria.id_categoria, categoria.nombre_categoria, categoria.estado)} 
                                                className={`btn ${categoria.estado ? 'btn-danger' : 'btn-success'}`}>
                                                <i className={`fa-solid ${categoria.estado ? 'fa-trash' : 'fa-check'}`}></i> {categoria.estado ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='row mt-4'>
                    <div className='col-12'>
                        <h4 className="text-center">Categorías Desactivadas</h4>
                        <div className='table-responsive-lg'>
                            <table className='table table-hover table-striped table-bordered'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Categoria</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {categoriasDesactivadas.map((categoria, i) => (
                                        <tr key={categoria.id_categoria}>
                                            <td>{(i + 1)}</td>
                                            <td>{categoria.nombre_categoria}</td>
                                            <td>
                                                <span className={`badge ${categoria.estado ? 'bg-success' : 'bg-danger'}`}>
                                                    {categoria.estado ? 'Activo' : 'Desactivado'}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => changeState(categoria.id_categoria, categoria.nombre_categoria, categoria.estado)} 
                                                    className={`btn ${categoria.estado ? 'btn-danger' : 'btn-success'}`}>
                                                    <i className={`fa-solid ${categoria.estado ? 'fa-trash' : 'fa-check'}`}></i> {categoria.estado ? 'Desactivar' : 'Activar'}
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

            <div id='modalCategorias' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog modal-lg'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5>{title}</h5>
                        </div>
                        <div className='modal-body'>
                            <div className='mb-3'>
                                <label htmlFor='nombre' className='form-label'>Nombre Categoria</label>
                                <input 
                                    type='text' 
                                    id='nombre' 
                                    className='form-control' 
                                    placeholder='Nombre de la categoria'
                                    value={nombre_categoria} 
                                    onChange={(e) => setNombre_categoria(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-secondary' id='btnCerrar' data-bs-dismiss='modal'>Cerrar</button>
                            <button type='button' className='btn btn-primary' onClick={validar}>Guardar</button>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    );
};

export default ShowCategorias;
