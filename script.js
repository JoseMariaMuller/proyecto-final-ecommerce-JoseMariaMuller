
// Array de productos
const menuitems = [
    {  nombre: "Doble cuarto de libra con queso", descripcion: "Deliciosa hamburguesa con doble carne y queso.", precio: 8.99, imagen: "img/doblecuartodelibraconqueso.jpg" },
    {  nombre: "Chicken Burger", descripcion: "Hamburguesa de pollo crujiente.", precio: 7.99, imagen: "img/mcpollo.jpg" },
    {  nombre: "Crispy BBQ", descripcion: "Carne crujiente con salsa BBQ.", precio: 9.49, imagen: "img/mccrispybbq.jpg" },
    {  nombre: "Classic Burger", descripcion: "La clásica hamburguesa para todos los gustos.", precio: 6.99, imagen: "img/bigmac.jpg" },
    {  nombre: "Cheeseburger", descripcion: "Hamburguesa clásica con queso derretido.", precio: 5.49, imagen: "img/mcnifica.jpg" },
    {  nombre: "Nuggets", descripcion: "Tiernos y crujientes nuggets de pollo (10 piezas).", precio: 4.99, imagen: "img/nuggets.jpg" },
    {  nombre: "Jugo de manzana", descripcion: "Refrescante jugo de manzana natural.", precio: 2.49, imagen: "img/jugomanzana.jpg" },
    {  nombre: "Agua", descripcion: "Agua mineral pura y refrescante.", precio: 1.99, imagen: "img/agua.jpg" },
    {  nombre: "Flurry Delight", descripcion: "Helado cremoso con trozos de galleta y salsa.", precio: 3.99, imagen: "img/mcflurry.jpg" },
    {  nombre: "ChocoDelight Sundae", descripcion: "Postre helado con deliciosa salsa de chocolate.", precio: 2.99, imagen: "img/sundaechocolate.jpg" }
];

let menuHTML = "";
for(let indice = 0; indice < menuitems.length; indice++){
    menuHTML += `<div class="producto">
                <img src=${menuitems[indice].imagen}
                    alt="Producto 1">
                <h2>${menuitems[indice].nombre}</h2>
                <p>${menuitems[indice].descripcion}</p>
                <p>Precio: $${menuitems[indice].precio}</p>
                <input class="btn-comprar" type="button" value="Comprar">
            </div> `;
}
const cartadeproductos = document.getElementById("cartadeproductos");
cartadeproductos.innerHTML = menuHTML;

const btncomprar = document.querySelectorAll(".btn-comprar");
console.log(btncomprar);

const listacarrito = document.querySelector("#carrito ul");
console.log(listacarrito);

const totalCarrito = document.querySelector("#carrito p");
console.log(totalCarrito);

const mensajeCarrito = document.getElementById("mensaje");
let totalAPagar = 0;

for(let indice = 0; indice < btncomprar.length; indice++){
    function agregarCarrito(){
        console.log("click" + " " + indice);
        const productoSeleccionado = document.createElement("li");
        
        productoSeleccionado.innerText = `${menuitems[indice].nombre} - Precio: $${menuitems[indice].precio}`;

        console.log(productoSeleccionado);

        listacarrito.appendChild(productoSeleccionado);

        totalAPagar += menuitems[indice].precio;
        totalAPagar = Math.round(totalAPagar * 100) / 100;
        totalCarrito.innerText = `Total a pagar: $${totalAPagar}`;

        mensajeCarrito.innerText = "";
    }
    console.log(btncomprar[indice]);
    btncomprar[indice].addEventListener("click", agregarCarrito);
}


const btnborrar = document.getElementById("btnborrar");
function borrarCarrito(){
    listacarrito.innerHTML = ""; 
    totalAPagar = 0;  
    totalCarrito.innerText = `Total a pagar: $${totalAPagar}`;
    mensajeCarrito.innerText = "";
}
btnborrar.addEventListener("click", borrarCarrito);

const btnpagar = document.querySelector("#btnpagar");
function pagar(){
    if(listacarrito.innerText === ""){
       mensajeCarrito.innerText = "El carrito esta vacio";
    } else {
    window.location.href = "pagar.html";
}
}
btnpagar.addEventListener("click", pagar);
