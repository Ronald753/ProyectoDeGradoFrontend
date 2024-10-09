// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import ShowCategorias from './components/Categorias/ShowCategorias'; // Asegúrate de que la ruta sea correcta
import ShowIngredientes from './components/Ingredientes/ShowIngredientes';
import ShowProductos from './components/Productos/ShowProductos';
import Home from './components/Home/Home'; // Crear un componente Home
import CreateProducto from './components/Productos/CreateProducto';
import ShowMenus from './components/Menu/ShowMenus';
import EditMenu from './components/Menu/EditMenu';
import EditProducto from './components/Productos/EditProducto';
import ShowUsuarios from './components/Usuarios/ShowUsuarios';


const App = () => {
    return (
        <Router>
            <Sidebar />
            <div style={{ marginLeft: '250px', padding: '20px' }}> {/* Espacio para el contenido */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/categorias" element={<ShowCategorias />} />
                    <Route path="/ingredientes" element={<ShowIngredientes />} />
                    <Route path="/productos" element={<ShowProductos />} />
                    <Route path="/productos/editarproducto/:id" element={<EditProducto />} />
                    <Route path="/crearproducto" element={<CreateProducto />} />
                    <Route path="/menus" element={<ShowMenus />} />
                    <Route path="/edit-menu/:id_menu" element={<EditMenu />} /> 
                    <Route path="/usuarios" element={<ShowUsuarios />} /> 
                    {/* Agrega más rutas según sea necesario */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
