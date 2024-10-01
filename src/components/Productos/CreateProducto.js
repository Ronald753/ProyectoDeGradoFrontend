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
        getCategorias()
            .then(response => {
                if (Array.isArray(response.data)) {
                    setCategorias(response.data);
                } else {
                    setCategorias([]);
                }
            })
            .catch(error => console.error('Error al cargar categorías', error));

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
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="text-center mb-4 text-primary">Crear Nuevo Producto</h2>
                    <form onSubmit={handleSubmit} className="shadow-lg p-4 rounded bg-white">
                        <div className="form-group mb-3">
                            <label htmlFor="categoria" className="form-label">Categoría</label>
                            <select
                                name="id_categoria"
                                id="categoria"
                                className="form-select"
                                onChange={handleInputChange}
                                value={producto.id_categoria}
                                required
                            >
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

                        <div className="form-group mb-3">
                            <label htmlFor="nombre_producto" className="form-label">Nombre del Producto</label>
                            <input
                                type="text"
                                name="nombre_producto"
                                id="nombre_producto"
                                className="form-control"
                                value={producto.nombre_producto}
                                onChange={handleInputChange}
                                placeholder="Escriba el nombre del producto"
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <textarea
                                name="descripcion"
                                id="descripcion"
                                className="form-control"
                                value={producto.descripcion}
                                onChange={handleInputChange}
                                placeholder="Describa el producto"
                                required
                            ></textarea>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="precio" className="form-label">Precio</label>
                            <input
                                type="number"
                                name="precio"
                                id="precio"
                                className="form-control"
                                value={producto.precio}
                                onChange={handleInputChange}
                                placeholder="Ingrese el precio"
                                required
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label">Ingredientes</label>
                            <div className="ingredientes-list overflow-auto p-2 border rounded" style={{ maxHeight: '150px' }}>
                                {ingredientes.length > 0 ? ingredientes.map(ingrediente => (
                                    <div key={ingrediente.id_ingrediente} className="form-check">
                                        <input
                                            type="checkbox"
                                            value={ingrediente.id_ingrediente}
                                            className="form-check-input"
                                            checked={selectedIngredientes.includes(ingrediente.id_ingrediente.toString())}
                                            onChange={handleIngredienteChange}
                                            id={`ingrediente-${ingrediente.id_ingrediente}`}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`ingrediente-${ingrediente.id_ingrediente}`}
                                        >
                                            {ingrediente.nombre_ingrediente}
                                        </label>
                                    </div>
                                )) : <p>No hay ingredientes disponibles</p>}
                            </div>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Crear Producto</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProducto;
