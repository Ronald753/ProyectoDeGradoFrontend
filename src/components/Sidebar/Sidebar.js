import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true); // Estado para controlar si el sidebar está abierto o cerrado

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Alterna el estado entre abierto y cerrado
    };

    return (
        <>
            {/* Botón de hamburguesa para pantallas pequeñas */}
            <button className="hamburger" onClick={toggleSidebar}>
                <i className="fa-solid fa-bars"></i>
            </button>

            {/* Sidebar con clases dinámicas dependiendo del estado */}
            <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <h2 className="sidebar-title">Panel de Navegación</h2>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/" className="sidebar-link">
                            <i className="fa-solid fa-home"></i> Inicio
                        </Link>
                    </li>
                    <li>
                        <Link to="/categorias" className="sidebar-link">
                            <i className="fa-solid fa-list"></i> Categorías
                        </Link>
                    </li>
                    <li>
                        <Link to="/productos" className="sidebar-link">
                            <i className="fa-solid fa-box"></i> Productos
                        </Link>
                    </li>
                    <li>
                        <Link to="/crearproducto" className="sidebar-link">
                            <i className="fa-solid fa-plus"></i> Crear producto
                        </Link>
                    </li>
                    <li>
                        <Link to="/ingredientes" className="sidebar-link">
                            <i className="fa-solid fa-carrot"></i> Ingredientes
                        </Link>
                    </li>
                    <li>
                        <Link to="/menus" className="sidebar-link">
                            <i className="fa-solid fa-utensils"></i> Menus
                        </Link>
                    </li>
                    <li>
                        <Link to="/usuarios" className="sidebar-link">
                            <i className="fa-solid fa-user"></i> Usuarios
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
