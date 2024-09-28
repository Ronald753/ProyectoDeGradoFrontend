// ShowMenus.js
import React, { useEffect, useState } from 'react';
import { getMenus } from '../../services/menuService';
import { useNavigate } from 'react-router-dom';
import './ShowMenus.css';

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
        <div>
            <h2>Menús Disponibles</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo de Menú</th>
                        <th>Fecha de Creación</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.map(menu => (
                        <tr key={menu.id_menu}>
                            <td>{menu.id_menu}</td>
                            <td>{menu.tipo_menu}</td>
                            <td>{new Date(menu.fecha_creacion).toLocaleDateString()}</td>
                            <td>{menu.estado ? 'Activo' : 'Desactivado'}</td>
                            <td>
                                <button onClick={() => handleEditMenu(menu.id_menu)}>Editar Productos</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowMenus;
