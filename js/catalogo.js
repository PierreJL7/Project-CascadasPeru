/*filter */
let filter = [];
/*array */
let productos = [];
/*funcion de cargar productos */
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data =>{
        productos = data;
        cargarProductos(productos)
    })




const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


function cargarProductos(productosElegidos){

    contenedorProductos.innerHTML = "";



    productosElegidos.forEach(producto =>{
    
console.log("El valor del producto", producto?.dolar);

    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML =
    `
    <img class = "producto-imagen" src="${producto.imagen}" alt="">
        <div class="producto-detalles">
            <h3 class="producto-titulo">${producto.titulo}</h3>
            <p  style= "margin-top: 5px"  class="marca-opcional">${producto.marca ? producto.marca : " "}</p>
            <p>${producto.medida ? producto.medida : " "}  </p>
            <p class="producto-descripcion">${producto.descripcion}</p>
            <p style = "font-weight: 800" class="producto-precio">${producto.precio ? producto.precio : " "}</p>
            <p style = "font-weight: 800" class="producto-dolar">${  producto.dolar ? producto.dolar : " "}</p>
            <button class="producto-agregar" id="${producto.id}">Más información</button>
        </div>
    `;

    contenedorProductos.append(div);
})
    actualizarBotonesAgregar();

}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) =>{

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos"){
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id );
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;


            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos"
            cargarProductos(productos);
        }


    })

});

/*FILTRO DE BUSQUEDA */
document.getElementById("myinput").addEventListener("keyup",function(){
    let text = document.getElementById("myinput").value

    filter = productos.filter(function(a){
        if(a.name.includes(text)){
            return a.name;
        }
    });
    if(this.value ==""){
        cargarProductos(productos);
    }
    else{
        if(filter == ""){
            document.getElementById("para").style.display = 'block'
            document.getElementById("contenedor-productos").innerHTML = "";
        }
        else {
            cargarProductos(filter);
            document.getElementById("para").style.display = 'none'
        }
    }
})




function actualizarBotonesAgregar(){
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    
    botonesAgregar.forEach(boton =>{
        boton.addEventListener("click", agregarAlCarrito);

    });

}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");


if(productosEnCarritoLS){
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
}else{
    productosEnCarrito = [];
}

    
function agregarAlCarrito(e){

    Toastify({
        text: "REDIRIGIENDO..",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #8bd0fa, #008ce3)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"

        },
        offset: {
            x: `1.5rem`, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: `1.5rem` // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)){
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad ++;

    } else{
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc,producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}