// ShowMenus.js
import React, { useEffect, useState } from 'react';
import { getMenus } from '../../services/menuService';
import { useNavigate } from 'react-router-dom';
import './ShowMenus.css'; // Asegúrate de crear un archivo CSS si es necesario

const ShowMenus = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await getMenus();
                setMenus(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const handleEditMenu = (id) => {
        navigate(`/edit-menu/${id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='App'>
            <div className='container-fluid'>
                {/* Tabla de Menús */}
                <div className='row mt-4'>
                    <div className='col-12'>
                        <h4>Menús Disponibles</h4>
                        <div className='table-responsive-lg'>
                            <table className='table table-hover table-striped table-bordered'>
                                <thead className='table-dark'>
                                    <tr>
                                        <th>#</th>
                                        <th>Tipo de Menú</th>
                                        <th>Fecha de Creación</th>
                                        <th>Estado</th>
                                        <th>Productos</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {menus.map((menu, i) => (
                                        <tr key={menu.menu.id_menu}>
                                            <td>{i + 1}</td>
                                            <td>{menu.menu.tipo_menu}</td>
                                            <td>{new Date(menu.menu.fecha_creacion).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${menu.menu.estado ? 'bg-success' : 'bg-danger'}`}>
                                                    {menu.menu.estado ? 'Activo' : 'Desactivado'}
                                                </span>
                                            </td>
                                            <td>
                                                <ul>
                                                    {menu.productos.map(producto => (
                                                        <li key={producto.id_menu_producto}>
                                                            {producto.nombre_producto} {/* Aquí puedes agregar el nombre del producto si está disponible */}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td>
                                                <button onClick={() => handleEditMenu(menu.menu.id_menu)} 
                                                    className='btn btn-warning'>
                                                    <i className='fa-solid fa-edit'></i> Editar Productos
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

export default ShowMenus;
