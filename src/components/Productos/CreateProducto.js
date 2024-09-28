import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getCategorias } from '../../services/categoriasService';
import { getIngredientes } from '../../services/ingredientesService';
import { postProducto } from '../../services/productosService';
import './ShowProductos.css';

const CreateProducto = () => {
    const [categorias, setCategorias] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const [selectedIngredientes, setSelectedIngredientes] = useState([]);
    const [producto, setProducto] = useState({
        id_categoria: '',
        nombre_producto: '',
        descripcion: '',
        precio: ''
    });

    useEffect(() => {
        // Obtener categorías activas
        getCategorias()
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCategorias(response.data);
                } else {
                    setCategorias([]);
                }
            })
            .catch(error => console.error('Error al cargar categorías', error));

        // Obtener ingredientes activos
        getIngredientes()
            .then(response => {
                if (Array.isArray(response.data)) {
                    setIngredientes(response.data);
                } else {
                    setIngredientes([]);
                }
            })
            .catch(error => console.error('Error al cargar ingredientes', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleIngredienteChange = (e) => {
        const value = e.target.value;
        setSelectedIngredientes(prevSelected => 
            prevSelected.includes(value)
                ? prevSelected.filter(ingrediente => ingrediente !== value)
                : [...prevSelected, value]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación para asegurarse de que al menos un ingrediente esté seleccionado
        if (selectedIngredientes.length === 0) {
            Swal.fire('Error', 'Debe seleccionar al menos un ingrediente', 'error');
            return;
        }

        const productoData = {
            ...producto,
            ingredientes: selectedIngredientes
        };

        try {
            await postProducto(productoData);
            Swal.fire('Producto creado!', 'El producto ha sido creado exitosamente', 'success');
            
            // Limpiar los campos después de crear el producto
            setProducto({
                id_categoria: '',
                nombre_producto: '',
                descripcion: '',
                precio: ''
            });
            setSelectedIngredientes([]);
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al crear el producto', 'error');
        }
    };

    return (
        <div className="create-producto container mt-5">
            <h2 className="text-center mb-4">Crear Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
                <div className="form-group">
                    <label>Categoría</label>
                    <select name="id_categoria" className="form-control" onChange={handleInputChange} value={producto.id_categoria}>
                        <option value="">Seleccione una categoría</option>
                        {Array.isArray(categorias) && categorias.length > 0 ? (
                            categorias.map(categoria => (
                                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                    {categoria.nombre_categoria}
                                </option>
                            ))
                        ) : (
                            <option value="">No hay categorías disponibles</option>
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label>Nombre del Producto</label>
                    <input
                        type="text"
                        name="nombre_producto"
                        className="form-control"
                        value={producto.nombre_producto}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        name="descripcion"
                        className="form-control"
                        value={producto.descripcion}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label>Precio</label>
                    <input
                        type="number"
                        name="precio"
                        className="form-control"
                        value={producto.precio}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Ingredientes</label>
                    <div>
                        {ingredientes.length > 0 ? ingredientes.map(ingrediente => (
                            <div key={ingrediente.id_ingrediente} className="form-check">
                                <input
                                    type="checkbox"
                                    value={ingrediente.id_ingrediente}
                                    className="form-check-input"
                                    checked={selectedIngredientes.includes(ingrediente.id_ingrediente.toString())}
                                    onChange={handleIngredienteChange}
                                />
                                <label className="form-check-label">{ingrediente.nombre_ingrediente}</label>
                            </div>
                        )) : <p>No hay ingredientes disponibles</p>}
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">Crear Producto</button>
            </form>
        </div>
    );
};

export default CreateProducto;
