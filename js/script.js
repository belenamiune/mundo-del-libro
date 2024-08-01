// Variables
let boooks = [];
let cart = [];
const price = '$';
let currentItems = 0;
const switchIcon = document.getElementById("switch");
switchIcon.classList = "fa-solid fa-sun"
const booksList = document.querySelector('#books');
const cartEl = document.querySelector('#cart');
const total = document.querySelector('#total');
const buttonEmptyCart = document.querySelector('#emptyCart');
const buyBookButton = document.querySelector('#buyBook');
let input = document.getElementById('input');
let badge = document.getElementById("itemsAdded");


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
        miNodeAutor.classList.add('card-text', 'autor');
        miNodeAutor.textContent = info.autor;

        // Image
        const miNodeImage = document.createElement('img');
        miNodeImage.classList.add('img', 'card-img-top');
        miNodeImage.setAttribute('src', info.image);

        // Precio
        const miNodePrice = document.createElement('p');
        miNodePrice.classList.add('card-text', 'price');
        miNodePrice.textContent = `${price} ${info.price}`;

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

initializeView = () => {
    boooks = [];
    cart = [];
    currentItems = 0;
    renderBooks();
    renderCart();
}

// Función que añade el libro al carrito
addToCart = (event) => {
    cart.push(event.target.getAttribute('marker'));
    renderCart();
    showNumberOfItemsInCart();
}

// Función que muestra el número de productos disponibles en el carrito
showNumberOfItemsInCart = () => {
    currentItems++;
    badge.innerHTML = currentItems;
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
    
            const miNode = document.createElement('li');;
            miNode.classList.add('list-group-item', 'text-right', 'mx-2');
            miNode.textContent = `${itemAmount} x ${miItem[0].name} - ${price}${miItem[0].price}`;
            
    
            const miButton = document.createElement('button');
            miButton.classList.add('btn', 'btn-danger', 'mx-5', 'btn-delete');
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
    currentItems = 0;
    badge.innerHTML = "0"
    renderCart();
}

// Función que abre el carrito
toggleCart = () => {
    document.querySelector('.sidecart').classList.toggle('open-cart');
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
        currentItems = 0;
        badge.innerHTML = "0";
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
    const container = document.querySelector(".show-alerts");
    container.appendChild(successAlert);
    toggleCart();

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
    const container = document.querySelector(".show-alerts");
    container.appendChild(warningAlert);
    toggleCart();

    setTimeout(() => {
        container.removeChild(warningAlert)
    }, 5000);
}

// Función para cambiar el modo visual de la página
switchMode = () => {
   let icon = document.getElementById("switch");
   let navbar = document.getElementById("navbar");
   let sidecart = document.querySelector('.sidecart');

   
   let cardBody = document.getElementsByClassName("card");
   let cardTitle = document.getElementsByClassName("card-title");
   let cardSubtitle = document.getElementsByClassName("card-text");
   let cardAutor = document.getElementsByClassName("autor");
   let cardPrice = document.getElementsByClassName("price");
   let bookAdded = document.getElementsByClassName("list-group-item");

    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light')
        icon.classList = "fa-solid fa-sun";
        document.body.classList = "light-mode";
        navbar.classList = "navbar-light";
        sidecart.classList.toggle("sidecart-light")
        sidecart.classList.remove("sidecart-dark");

        for (let i = 0; i < cardTitle.length; i++) {
            ((index) => {
                cardBody[index].classList.add("dark-body");
                cardTitle[index].classList.add("light-text");
                cardSubtitle[index].classList.add("light-text");
                cardAutor[index].classList.add("light-text");
                cardPrice[index].classList.add("light-text");
            })(i);
          }

          for(let i = 0; i < bookAdded.length; i++) {
            ((index) => {
                    bookAdded[index].classList.add("dark-body");
            })(i);
          }
        
    }
    else {
        icon.classList = "fa-solid fa-moon";
        document.documentElement.setAttribute('data-bs-theme','dark');
        document.body.classList = "dark-mode"
        navbar.classList = "navbar-dark"
        sidecart.classList.toggle("sidecart-dark");
        sidecart.classList.remove("sidecart-light")

        for (let i = 0; i < cardTitle.length; i++) {
            ((index) => {
                cardBody[index].classList.add("dark-body");
                cardTitle[index].classList.add("dark-text");
                cardSubtitle[index].classList.add("dark-text");
                cardAutor[index].classList.add("dark-text");
                cardPrice[index].classList.add("dark-text");
            })(i);
          }

          for(let i = 0; i < bookAdded.length; i++) {
            ((index) => {
                    bookAdded[index].classList.add("dark-body");
            })(i);
          }
    }
}


// Función que filtra por titulo de libro
filterByTitle = () => {
    let booksCard = document.getElementsByClassName("card");
    let filter = input.value.toUpperCase();
        for (let i = 0; i < books.length; i++) {
             let bookName = booksCard[i].getElementsByClassName('card-title')[0].innerHTML;
            if (bookName.toUpperCase().indexOf(filter) == 0) {
                booksCard[i].style.display = 'list-group-item';   
            } else {
                booksCard[i].style.display = 'none';
            }
    }
}

// Función que resetea el filtro de búsqueda
resetFilters = () => {
    input.value = '';
    renderBooks();
}

// Eventos
buttonEmptyCart.addEventListener('click', emptyCart);
buyBookButton.addEventListener('click', buyBook);