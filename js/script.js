// Variables
let boooks = [];
let cart = [];
const peso = '$';
const booksList = document.querySelector('#books');
const cartEl = document.querySelector('#cart');
const total = document.querySelector('#total');
const buttonEmptyCart = document.querySelector('#emptyCart');
const buyBookButton = document.querySelector('#buyBook');


// Llama a la base de datos para obtener todos los libros disponibles en dicho archivo .json
fetch('books.json')
    .then(response => response.json())
    .then(data => {
        books = data;
        renderBooks();
        renderCart();
    })
    .catch(err => console.error(err));



// Función que arma todos los productos del array de books en el HTML
renderBooks = () => {
    const booksDiv = document.getElementById('books');
    if (!booksDiv) return;

    booksDiv.innerHTML = '';
    books.forEach((info) => {
        
        const miNode = document.createElement('div');
        miNode.classList.add('card', 'col-sm-3', 'text-center');
        
        const miNodeCardBody = document.createElement('div');
        miNodeCardBody.classList.add('card-body');


        // Título
        const miNodeTitle = document.createElement('h5');
        miNodeTitle.classList.add('card-title');
        miNodeTitle.textContent = info.name;
        
        // Autor
        const miNodeAutor = document.createElement('h6');
        miNodeAutor.classList.add('card-text');
        miNodeAutor.textContent = info.autor;

        // Image
        const miNodeImage = document.createElement('img');
        miNodeImage.classList.add('img-f', 'card-img-top');
        miNodeImage.setAttribute('src', info.image);

        // Precio
        const miNodePrice = document.createElement('p');
        miNodePrice.classList.add('card-text');
        miNodePrice.textContent = `${peso} ${info.price}`;

        // Boton para agregar al carrito
        const miNodeButton = document.createElement('button');
        miNodeButton.classList.add('btn', 'btn-primary', 'add-cart');
        miNodeButton.textContent = 'Añadir al carrito';
        miNodeButton.setAttribute('marker', info.id);
        miNodeButton.addEventListener('click', addToCart);


        // Agregamos los nodos para que se "dibujen" en el HTML
        miNodeCardBody.appendChild(miNodeImage);
        miNodeCardBody.appendChild(miNodeTitle);
        miNodeCardBody.appendChild(miNodeAutor);
        miNodeCardBody.appendChild(miNodePrice);
        miNodeCardBody.appendChild(miNodeButton);
        miNode.appendChild(miNodeCardBody);
        booksList.appendChild(miNode);
    });
}

// Función que añade el libro al carrito
addToCart = (event) => {
    cart.push(event.target.getAttribute('marker'));
    renderCart();
    
    toggleCart();
}

// Función que muestra todos los elementos cargados al carrito visualemente
renderCart = () => {
    cartEl.textContent = '';
    
    const cartWithoutDuplicates = [...new Set(cart)];

    cartWithoutDuplicates.forEach((item) => {
        const miItem = books.filter((itemsList) => {
            return itemsList.id === parseInt(item);
        });
        
        const itemAmount = cart.reduce((total, itemId) => {
            return itemId === item ? total += 1 : total;
        }, 0);

        const miNode = document.createElement('li');
        miNode.classList.add('list-group-item', 'text-right', 'mx-2');
        miNode.textContent = `${itemAmount} x ${miItem[0].name} - ${peso}${miItem[0].price}`;
        

        const miButton = document.createElement('button');
        miButton.classList.add('btn', 'btn-danger', 'mx-5');
        miButton.textContent = 'X';
        miButton.style.marginLeft = '1rem';
        miButton.dataset.item = item;
        miButton.addEventListener('click', deleteBookfromCart);
        miNode.appendChild(miButton);
        cartEl.appendChild(miNode);
    });
    total.textContent = calcTotal();

}

// Función que elimina un libro del carrito
deleteBookfromCart = (event) => {
    const id = event.target.dataset.item;
    cart = cart.filter((cartId) => {
        return cartId !== id;
    });
    renderCart();
}

// Función que calcula el total
calcTotal = () => {
    return cart.reduce((total, item) => {
        const miItem = books.filter((itemsList) => {
            return itemsList.id === parseInt(item);
        });
        return total + miItem[0].price;
    }, 0).toFixed(2);
}

// Función que vacía el carrito
emptyCart = () => {
    cart = [];
    renderCart();
}

// Función para confirmar la compra
buyBook = () => {
    if(cart.length > 0) {
        showSuccessAlert();
    } else {
        showWarningAlert();
    }
    setTimeout(() => {
        cart = [];
        renderCart();
    }, 5000);
}


// Función que genera un alert mostrando el resultado exitoso de la compra 
showSuccessAlert = () => {
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user);

    const successAlert = document.createElement("div");
    successAlert.role = "alert"
    successAlert.className = "alert alert-success alert-dismissible fade show";
    successAlert.textContent = `¡Muchísimas gracias por su compra ${userData.userName}! Pronto estará recibiendo en ${userData.email} la factura correspondiente.`
    const container = document.querySelector(".totals");
    container.appendChild(successAlert);

    setTimeout(() => {
        container.removeChild(successAlert)
    }, 5000);
}

// Función que genera un alert avisandole al usuario que debe agregar un elemento para poder comprar
showWarningAlert = () => {
    const warningAlert = document.createElement("div");
    warningAlert.role = "alert"
    warningAlert.className = "alert alert-warning alert-dismissible fade show";
    warningAlert.textContent = "Para continuar con la compra debe agregar por lo menos un item al carrito.";
    const container = document.querySelector(".totals");
    container.appendChild(warningAlert);

    setTimeout(() => {
        container.removeChild(warningAlert)
    }, 5000);
}

// Eventos
buttonEmptyCart.addEventListener('click', emptyCart);
buyBookButton.addEventListener('click', buyBook);

// Funciones que se inician con el proyecto
function toggleCart(){
    document.querySelector('.sidecart').classList.toggle('open-cart');
  }
  