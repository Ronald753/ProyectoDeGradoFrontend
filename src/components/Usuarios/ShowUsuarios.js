import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { show_alerta } from '../../utils/functions';
import {
    getUsuarios,
    getUsuariosDesactives,
    postUsuario,
    updateUsuario,
    changeUsuarioState
} from '../../services/usuariosService';
import './ShowUsuarios.css'; // Importa el archivo CSS para estilos

const ShowUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosDesactivados, setUsuariosDesactivados] = useState([]);
    const [id_usuario, setId_usuario] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [rol, setRol] = useState('Empleado'); // Por defecto "Empleado"
    const [operation, setOperation] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        fetchUsuarios();
        fetchUsuariosDesactivados();
    }, []);

    const fetchUsuarios = async () => {
        const respuesta = await getUsuarios();
        setUsuarios(respuesta.data);
    };

    const fetchUsuariosDesactivados = async () => {
        const respuesta = await getUsuariosDesactives();
        setUsuariosDesactivados(respuesta.data);
    };

    const openModal = (op, usuario) => {
        if (op === 1) {
            setId_usuario('');
            setNombre('');
            setApellido('');
            setTelefono('');
            setEmail('');
            setContrasenia('');
            setRol('Empleado'); // Reiniciar rol al abrir modal de creación
        } else {
            setId_usuario(usuario.id_usuario);
            setNombre(usuario.nombre);
            setApellido(usuario.apellido);
            setTelefono(usuario.telefono);
            setEmail(usuario.email);
            setContrasenia('');
            setRol(usuario.rol);
        }
        setOperation(op);
        setTitle(op === 1 ? 'Registrar Usuario' : 'Editar Usuario');

        setTimeout(() => {
            document.getElementById('nombre').focus();
        }, 500);
    };

    const validar = () => {
        if (!nombre || !apellido || !telefono || !email || !contrasenia) {
            show_alerta('Completa todos los campos', 'warning');
        } else {
            const parametros = {
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                telefono: telefono.trim(),
                email: email.trim(),
                contrasenia: contrasenia.trim(),
                rol: rol.trim()
            };
            const metodo = operation === 1 ? 'POST' : 'PUT';
            enviarSolicitud(metodo, parametros);
        }
    };

    const enviarSolicitud = async (metodo, parametros) => {
        try {
            let respuesta;
            if (metodo === 'POST') {
                respuesta = await postUsuario(parametros);
            } else {
                respuesta = await updateUsuario(id_usuario, parametros);
            }

            show_alerta('Hecho', 'success');
            document.getElementById('btnCerrar').click();
            fetchUsuarios();
            fetchUsuariosDesactivados();
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.error(error);
        }
    };

    const changeState = (id_usuario, nombre, estado) => {
        const MySwal = withReactContent(Swal);
        const action = estado ? 'desactivar' : 'activar';
        MySwal.fire({
            title: `¿Seguro de ${action} el usuario ${nombre}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                changeUsuarioState(id_usuario, !estado)
                    .then(() => {
                        show_alerta(`Usuario ${estado ? 'desactivado' : 'activado'} con éxito`, 'success');
                        fetchUsuarios();
                        fetchUsuariosDesactivados();
                    })
                    .catch(() => {
                        show_alerta('Error al cambiar el estado del usuario', 'error');
                    });
            } else {
                show_alerta("El usuario no fue cambiado", "info");
            }
        });
    };

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3 justify-content-center'>
                    <div className='col-md-4'>
                        <div className='d-grid mx-auto'>
                            <button onClick={() => openModal(1)} className='btn btn-dark btn-lg' data-bs-toggle='modal' data-bs-target='#modalUsuarios'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir Usuario
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Tabla de Usuarios Activos */}
                <div className='row mt-4'>
                    <div className='col-12'>
                        <h4>Usuarios Activos</h4>
                        <div className='table-responsive-lg'>
                            <table className='table table-hover table-striped table-bordered'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Teléfono</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {usuarios.map((usuario, i) => (
                                        <tr key={usuario.id_usuario}>
                                            <td>{i + 1}</td>
                                            <td>{usuario.nombre}</td>
                                            <td>{usuario.apellido}</td>
                                            <td>{usuario.telefono}</td>
                                            <td>{usuario.email}</td>
                                            <td>{usuario.rol}</td>
                                            <td>
                                                <span className={`badge ${usuario.estado ? 'bg-success' : 'bg-danger'}`}>
                                                    {usuario.estado ? 'Activo' : 'Desactivado'}
                                                </span>
                                            </td>
                                            <td>
                                                <button onClick={() => openModal(2, usuario)} 
                                                    className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalUsuarios'>
                                                    <i className='fa-solid fa-edit'></i> Editar
                                                </button>
                                                &nbsp;
                                                <button onClick={() => changeState(usuario.id_usuario, usuario.nombre, usuario.estado)} 
                                                    className={`btn ${usuario.estado ? 'btn-danger' : 'btn-success'}`}>
                                                    <i className={`fa-solid fa-${usuario.estado ? 'trash' : 'check'}`}></i> {usuario.estado ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Tabla de Usuarios Desactivados */}
                <div className='row mt-4'>
                    <div className='col-12'>
                        <h4>Usuarios Desactivados</h4>
                        <div className='table-responsive-lg'>
                            <table className='table table-hover table-striped table-bordered'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Teléfono</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {usuariosDesactivados.map((usuario, i) => (
                                        <tr key={usuario.id_usuario}>
                                            <td>{i + 1}</td>
                                            <td>{usuario.nombre}</td>
                                            <td>{usuario.apellido}</td>
                                            <td>{usuario.telefono}</td>
                                            <td>{usuario.email}</td>
                                            <td>{usuario.rol}</td>
                                            <td>
                                                <span className={`badge ${usuario.estado ? 'bg-success' : 'bg-danger'}`}>
                                                    {usuario.estado ? 'Activo' : 'Desactivado'}
                                                </span>
                                            </td>
                                            <td>
                                                <button onClick={() => changeState(usuario.id_usuario, usuario.nombre, usuario.estado)} 
                                                    className={`btn ${usuario.estado ? 'btn-danger' : 'btn-success'}`}>
                                                    <i className={`fa-solid fa-${usuario.estado ? 'trash' : 'check'}`}></i> {usuario.estado ? 'Desactivar' : 'Activar'}
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
            
            {/* Modal para Añadir/Editar Usuario */}
            <div id='modalUsuarios' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog modal-lg'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5>{title}</h5>
                        </div>
                        <div className='modal-body'>
                            <div className='mb-3'>
                                <label htmlFor='nombre' className='form-label'>Nombre</label>
                                <input type='text' id='nombre' className='form-control' value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='apellido' className='form-label'>Apellido</label>
                                <input type='text' id='apellido' className='form-control' value={apellido} onChange={(e) => setApellido(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='telefono' className='form-label'>Teléfono</label>
                                <input type='text' id='telefono' className='form-control' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='email' className='form-label'>Email</label>
                                <input type='email' id='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='contrasenia' className='form-label'>Contraseña</label>
                                <input type='password' id='contrasenia' className='form-control' value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='rol' className='form-label'>Rol</label>
                                <select id='rol' className='form-select' value={rol} onChange={(e) => setRol(e.target.value)}>
                                    <option value='Empleado'>Empleado</option>
                                    <option value='Administrador'>Administrador</option>
                                    <option value='Cliente'>Cliente</option>
                                </select>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button id='btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                            <button type='button' className='btn btn-primary' onClick={validar}>{operation === 1 ? 'Registrar' : 'Actualizar'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowUsuarios;
