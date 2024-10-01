import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import Swal from 'sweetalert2';
import { getMenuById, updateMenu } from '../../services/menuService';
import { getProductos } from '../../services/productosService';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
import { show_alerta } from '../../utils/functions'; // Asegúrate de tener esta función

const EditMenu = () => {
    const { id_menu } = useParams();
    const navigate = useNavigate(); // Hook para redirigir
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
            show_alerta('Menú actualizado exitosamente', 'success');
            navigate('/menus'); // Redirigir a la ruta donde se muestran los menús
        } catch (err) {
            setError(err.message);
            show_alerta('Error al actualizar el menú', 'error');
        }
    };

    const handleProductSelection = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container-fluid">
            <div className="row mt-3 justify-content-center">
                <div className="col-md-8">
                    <h2 className="text-center">Editar Menú: {menu ? menu.tipo_menu : 'Cargando...'}</h2>

                    <div className="card mt-4">
                        <div className="card-header">
                            <h3>Seleccionar Productos</h3>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                {productos.map(product => (
                                    <li key={product.id_producto} className="list-group-item d-flex justify-content-between align-items-center">
                                        <label className="form-check-label">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedProducts.includes(product.id_producto)}
                                                onChange={() => handleProductSelection(product.id_producto)}
                                            />
                                            {product.nombre_producto}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card-footer text-end">
                            <button className="btn btn-primary mt-3" onClick={handleUpdateMenu}>
                                <i className="fa-solid fa-save"></i> Actualizar Menú
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMenu;
