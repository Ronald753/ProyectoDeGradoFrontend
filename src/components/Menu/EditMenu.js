import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMenuById, updateMenu } from '../../services/menuService';
import { getProductos } from '../../services/productosService';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

const EditMenu = () => {
    const { id_menu } = useParams();
    const [menu, setMenu] = useState(null);
    const [productos, setProductos] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await getMenuById(id_menu);
                console.log(response.data); // Verifica la estructura del objeto
                setMenu(response.data.menu); // Cambia aquí para acceder a menu
                setSelectedProducts(response.data.productos.map(p => p.id_producto) || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [id_menu]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await getProductos();
                setProductos(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProductos();
    }, []);

    const handleUpdateMenu = async () => {
        const updatedMenu = { ...menu, productos: selectedProducts };
        try {
            await updateMenu(id_menu, updatedMenu);
            alert('Menú actualizado exitosamente');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center">Editar Menú: {menu ? menu.tipo_menu : 'Cargando...'}</h2>
            <h3>Seleccionar Productos</h3>
            <ul className="list-group">
                {productos.map(product => (
                    <li key={product.id_producto} className="list-group-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id_producto)}
                                onChange={() => handleProductSelection(product.id_producto)}
                            />
                            {product.nombre_producto}
                        </label>
                    </li>
                ))}
            </ul>
            <button className="btn btn-primary mt-3" onClick={handleUpdateMenu}>Actualizar Menú</button>
        </div>
    );
};

export default EditMenu;
