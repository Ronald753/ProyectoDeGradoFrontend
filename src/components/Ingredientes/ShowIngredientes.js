import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../utils/functions';
import { 
    getIngredientes, 
    getIngredientesDesactives, 
    postIngrediente, 
    updateIngrediente, 
    changeIngredienteState 
} from '../../services/ingredientesService';
import './ShowIngredientes.css'; // Importa el archivo CSS para estilos

const ShowIngredientes = () => {
    const [ingredientes, setIngredientes] = useState([]);
    const [ingredientesDesactivados, setIngredientesDesactivados] = useState([]);
    const [id_ingrediente, setId_ingrediente] = useState('');
    const [nombre_ingrediente, setNombre_ingrediente] = useState('');
    const [descripcion_ingrediente, setDescripcion_ingrediente] = useState('');
    const [operation, setOperation] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetchIngredientes();
        fetchIngredientesDesactivados();
    }, []);

    const fetchIngredientes = async () => {
        const respuesta = await getIngredientes();
        setIngredientes(respuesta.data);
    };

    const fetchIngredientesDesactivados = async () => {
        const respuesta = await getIngredientesDesactives();
        setIngredientesDesactivados(respuesta.data);
    };

    const openModal = (op, id_ingrediente, nombre_ingrediente, descripcion_ingrediente) => {
        setId_ingrediente(id_ingrediente || '');
        setNombre_ingrediente(nombre_ingrediente || '');
        setDescripcion_ingrediente(descripcion_ingrediente || '');
        setOperation(op);
        setTitle(op === 1 ? 'Registrar Ingrediente' : 'Editar Ingrediente');

        setTimeout(() => {
            document.getElementById('nombre').focus();
        }, 500);
    };

    const validar = () => {
        if (nombre_ingrediente.trim() === '' || descripcion_ingrediente.trim() === '') {
            show_alerta('Completa todos los campos', 'warning');
        } else {
            const parametros = {
                nombre_ingrediente: nombre_ingrediente.trim(),
                descripcion_ingrediente: descripcion_ingrediente.trim()
            };
            const metodo = operation === 1 ? 'POST' : 'PUT';
            enviarSolicitud(metodo, parametros);
        }
    };

    const enviarSolicitud = async (metodo, parametros) => {
        try {
            let respuesta;
            if (metodo === 'POST') {
                respuesta = await postIngrediente(parametros);
            } else {
                respuesta = await updateIngrediente(id_ingrediente, parametros);
            }

            show_alerta('Hecho', 'success'); // Ajusta según la respuesta de tu backend
            document.getElementById('btnCerrar').click();
            fetchIngredientes();
            fetchIngredientesDesactivados();
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.error(error);
        }
    };

    const changeState = (id_ingrediente, nombre_ingrediente, estado) => {
        const MySwal = withReactContent(Swal);
        const action = estado ? 'desactivar' : 'activar';
        MySwal.fire({
            title: `¿Seguro de ${action} el ingrediente ${nombre_ingrediente}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                changeIngredienteState(id_ingrediente, !estado)
                    .then(() => {
                        show_alerta(`Ingrediente ${estado ? 'desactivado' : 'activado'} con éxito`, 'success');
                        fetchIngredientes();
                        fetchIngredientesDesactivados();
                    })
                    .catch(() => {
                        show_alerta('Error al cambiar el estado del ingrediente', 'error');
                    });
            } else {
                show_alerta("El ingrediente no fue cambiado", "info");
            }
        });
    };

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalIngredientes'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ingrediente</th>
                                        <th>Descripción</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {ingredientes.map((ingrediente, i) => (
                                        <tr key={ingrediente.id_ingrediente}>
                                            <td>{i + 1}</td>
                                            <td>{ingrediente.nombre_ingrediente}</td>
                                            <td>{ingrediente.descripcion_ingrediente}</td>
                                            <td>{ingrediente.estado ? 'Activo' : 'Desactivado'}</td>
                                            <td>
                                                <button onClick={() => openModal(2, ingrediente.id_ingrediente, ingrediente.nombre_ingrediente, ingrediente.descripcion_ingrediente)} 
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalIngredientes'>
                                                    <i className='fa-solid fa-edit'></i> Editar
                                                </button>
                                                &nbsp;
                                                <button onClick={() => changeState(ingrediente.id_ingrediente, ingrediente.nombre_ingrediente, ingrediente.estado)} 
                                                    className='btn btn-danger'>
                                                    <i className='fa-solid fa-trash'></i> {ingrediente.estado ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='col-12 col-lg-8 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ingrediente</th>
                                        <th>Descripción</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {ingredientesDesactivados.map((ingrediente, i) => (
                                        <tr key={ingrediente.id_ingrediente}>
                                            <td>{i + 1}</td>
                                            <td>{ingrediente.nombre_ingrediente}</td>
                                            <td>{ingrediente.descripcion_ingrediente}</td>
                                            <td>{ingrediente.estado ? 'Activo' : 'Desactivado'}</td>
                                            <td>
                                                <button onClick={() => changeState(ingrediente.id_ingrediente, ingrediente.nombre_ingrediente, ingrediente.estado)} 
                                                    className='btn btn-success'>
                                                    <i className='fa-solid fa-check'></i> {ingrediente.estado ? 'Desactivar' : 'Activar'}
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
            <div id='modalIngredientes' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5>{title}</h5>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-carrot'></i></span>
                                <input type='text' id='nombre' className='form-control' placeholder='Nombre del ingrediente'
                                    value={nombre_ingrediente} onChange={(e) => setNombre_ingrediente(e.target.value)} />
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-info-circle'></i></span>
                                <input type='text' id='descripcion' className='form-control' placeholder='Descripción del ingrediente'
                                    value={descripcion_ingrediente} onChange={(e) => setDescripcion_ingrediente(e.target.value)} />
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button id='btnGuardar' className='btn btn-primary' onClick={validar}>
                                    Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowIngredientes;
