// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Importa el archivo CSS para estilos

const Sidebar = () => {
    return (
        <div className="sidebar">
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
                {/* Agrega más enlaces según sea necesario */}
            </ul>
        </div>
    );
};

export default Sidebar;
