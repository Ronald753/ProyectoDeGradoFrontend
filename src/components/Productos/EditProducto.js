import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById, updateProducto } from '../../services/productosService';
import { getCategorias } from '../../services/categoriasService';
import { getIngredientes } from '../../services/ingredientesService';
import Swal from 'sweetalert2';

const EditProducto = () => {
  const { id } = useParams(); // Obtén el ID de la URL
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    id_categoria: '',
    nombre_producto: '',
    descripcion: '',
    precio: '',
    ingredientes: [] // Aquí se almacenarán los IDs de los ingredientes seleccionados
  });
  const [categorias, setCategorias] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  useEffect(() => {
    // Cargar datos del producto
    getProductoById(id)
      .then(response => {
        setProducto({
          id_categoria: response.data.id_categoria,
          nombre_producto: response.data.nombre_producto,
          descripcion: response.data.descripcion,
          precio: response.data.precio,
          ingredientes: response.data.ingredientes ? response.data.ingredientes.map(ingrediente => ingrediente.id_ingrediente) : []
        });
      })
      .catch(error => console.error('Error al cargar el producto', error));

    // Cargar categorías
    getCategorias()
      .then(response => setCategorias(response.data))
      .catch(error => console.error('Error al cargar las categorías', error));

    // Cargar ingredientes
    getIngredientes()
      .then(response => setIngredientes(response.data))
      .catch(error => console.error('Error al cargar los ingredientes', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  // Manejar cambios en los checkboxes de ingredientes
  const handleIngredientChange = (e) => {
    const { value, checked } = e.target;
    const ingredientId = parseInt(value); // Asegúrate de que el ID sea un número

    let updatedIngredientes = [...producto.ingredientes];
    if (checked) {
      // Agregar el ingrediente si está seleccionado
      updatedIngredientes.push(ingredientId);
    } else {
      // Eliminar el ingrediente si está deseleccionado
      updatedIngredientes = updatedIngredientes.filter(id => id !== ingredientId);
    }
    setProducto({ ...producto, ingredientes: updatedIngredientes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProducto(id, producto);
      Swal.fire('Producto actualizado', 'El producto se ha actualizado correctamente', 'success');
      navigate('/productos'); // Redirige a la lista de productos
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al actualizar el producto', 'error');
    }
  };

  return (
    <div className="edit-producto container mt-5">
      <h2 className="text-center mb-4">Editar Producto</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        {/* Campo para seleccionar la categoría */}
        <div className="form-group">
          <label>Categoría</label>
          <select
            name="id_categoria"
            className="form-control"
            onChange={handleInputChange}
            value={producto.id_categoria}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map(categoria => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre_categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para el nombre del producto */}
        <div className="form-group mt-3">
          <label>Nombre del Producto</label>
          <input
            type="text"
            name="nombre_producto"
            className="form-control"
            placeholder="Nombre del producto"
            value={producto.nombre_producto}
            onChange={handleInputChange}
          />
        </div>

        {/* Campo para la descripción */}
        <div className="form-group mt-3">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            placeholder="Descripción del producto"
            value={producto.descripcion}
            onChange={handleInputChange}
          />
        </div>

        {/* Campo para el precio */}
        <div className="form-group mt-3">
          <label>Precio</label>
          <input
            type="number"
            name="precio"
            className="form-control"
            placeholder="Precio"
            value={producto.precio}
            onChange={handleInputChange}
          />
        </div>

        {/* Campo para seleccionar ingredientes con checkboxes */}
        <div className="form-group mt-3">
          <label>Ingredientes</label>
          <div>
            {ingredientes.map(ingrediente => (
              <div key={ingrediente.id_ingrediente} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`ingrediente-${ingrediente.id_ingrediente}`}
                  value={ingrediente.id_ingrediente}
                  checked={producto.ingredientes.includes(ingrediente.id_ingrediente)}
                  onChange={handleIngredientChange}
                />
                <label className="form-check-label" htmlFor={`ingrediente-${ingrediente.id_ingrediente}`}>
                  {ingrediente.nombre_ingrediente}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de actualización */}
        <button type="submit" className="btn btn-primary btn-block mt-4">
          Actualizar Producto
        </button>
      </form>
    </div>
  );
};

export default EditProducto;
