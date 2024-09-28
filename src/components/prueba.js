import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../utils/functions';

//'id_categoria', 'nombre_categoria', 'estado'
const ShowCategorias = () => {
    const url='http://127.0.0.1:8000/products/categorias/add/'
    const [categorias, setCategorias]= useState([]);
    const [id_categoria, setId_categoria]= useState('');
    const [nombre_categoria, setNombre_categoria]= useState('');
    const [estado, setEstado]= useState('');
    const [operation, setOperation]= useState('');
    const [title, setTitle]= useState('');

    

    const getCategorias = async () => {
        const respuesta = await axios.get(url);
        setCategorias(respuesta.data);
    }
    const openModal = (op, id_categoria, nombre_categoria) =>{
        setId_categoria('');
        setNombre_categoria('');
        setOperation(op);
        if(op === 1){
            setTitle('Registrar Categoria')
        }
        else if(op === 2){
            setTitle('Editar Categoria');
            setId_categoria(id_categoria);
            setNombre_categoria(nombre_categoria);
        }
        window.setTimeout(function(){
            document.getElementById('nombre').focus();
        },500);
    }
    const validar = ()=> {
        var parametros;
        var metodo;
        if(nombre_categoria.trim() === ''){
            show_alerta('Escribe el nombre de la categoria', 'warning');
        } else {
            if(operation === 1){
                parametros = {nombre_categoria:nombre_categoria.trim()};
                metodo= 'POST';
            } else {
                parametros = {nombre_categoria:nombre_categoria.trim()};
                metodo= 'PUT';
            }
            enviarSolicitud(metodo, parametros)
        }
    }

    const enviarSolicitud = async(metodo, parametros) => {
        await axios({method:metodo, url: url, data:parametros}).then(function(respuesta){
            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj, tipo);
            if(tipo === 'succes'){
                document.getElementById('btnCerrar').click();
                getCategorias();
            }
        })
        .catch(function(error){
            show_alerta('Error en la solicitud', 'error');
            console.log(error);
        })
    }

    const deleteCategoria= (id_categoria, nombre_categoria) =>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: '¿Seguro de eliminar la categoria '+nombre_categoria+' ?',
            icon: 'question', text:'No se podrá dar marcha atrás',
            showCancelButton:true, confirmButtonText:'Si, eliminar', cancelButtonText:'Cancelar'
        }).then((result) =>{
            if(result.isConfirmed){
                setId_categoria(id_categoria);
                enviarSolicitud('DELETE', {id_categoria:id_categoria});
            } else {
                show_alerta("La categoria no fue eliminada", "info");
            }
        })
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md-4 offset-md-4'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=> openModal(1)} className='btn btn-dark' data-bs-toggle='modal' data-bs-target='#modalCategorias'>
                            <i className='fa-solid fa-circle-plus'></i>Añadir
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                    <div className='table-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr><th>#</th><th>Categoria</th><th>Estado</th></tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {categorias.map( (categoria, i) => (
                                    <tr key={categoria.id_categoria}>
                                        <td>{(i+1)}</td>
                                        <td>{categoria.nombre_categoria}</td>
                                        <td>{categoria.estado}</td>
                                        <td>
                                            <button onClick={()=> openModal(2,categoria.id_categoria, categoria.nombre_categoria)} 
                                            className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalCategorias'>
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp;
                                            <button onClick={()=>deleteCategoria(categoria.id_categoria, categoria.nombre_categoria)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
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
        <div id='modalCategorias' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dimiss='modal' aria-label='Close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='nombre' className='form-control' placeholder='Nombre de la categoria'
                            value={nombre_categoria} onChange={(e)=> setNombre_categoria(e.target.value)}></input>
                        </div>
                        <div className='d-grid col-6 mx-auto'>
                            <button onClick={()=> validar()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                    </div>
                </div>
            </div> 
        </div>
    </div>
  )
}

export default ShowCategorias