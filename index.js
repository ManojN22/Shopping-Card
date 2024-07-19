const API = (() => {
  const URL = "http://localhost:3000";
  const cartURL = `${URL}/cart`;
  const inventoryURL = `${URL}/inventory`;

  const getCart = () => {
    return fetch(cartURL).then((res) => res.json());
    };

  const getInventory = () => {
    return fetch(inventoryURL).then((res) => res.json());
  };

  const addToCart = (cartItem) => {
    return fetch(cartURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartItem),
    }).then((res) => res.json());
  };

  const updateCart = (id, newAmount) => {
    var updateInfo = 
    {
      amount:newAmount
    };
    const updateCartURL= `${cartURL}/${id}`
    return fetch(updateCartURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateInfo),
    }).then((res) => res.json());
  };

  const deleteFromCart = (id) => {
    const deleteCartURL = `${cartURL}/${id}`;
    return fetch(deleteCartURL, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  const checkout = () => {
    // you don't need to add anything here
    return getCart().then((data) =>
      Promise.all(data.map((item) => deleteFromCart(item.id)))
    );
  };

  return {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

const Model = (() => {
  // implement your logic for Model
  class State {
    #onChangeCart;
    #onChangeInventory;
    #inventory;
    #cart;
    constructor() {
      this.#inventory = [];
      this.#cart = [];
    }
    get cart() {
      return this.#cart;
    }

    get inventory() {
      return this.#inventory;
    }

    set cart(newCart) {
      this.#cart = newCart;
      this.#onChangeCart();
    }
    set inventory(newInventory) {
      this.#inventory = newInventory;
      this.#onChangeInventory();
    }

    subscribeCart(cb) {
      this.#onChangeCart = cb;
    }
    subscribeInventory(cb) {
      this.#onChangeInventory = cb;
    }
  }
  const {
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  } = API;
  return {
    State,
    getCart,
    updateCart,
    getInventory,
    addToCart,
    deleteFromCart,
    checkout,
  };
})();

const View = (() => {
  // implement your logic for View
  const inventoryListEl = document.querySelector(".inventory-wrapper");
  const cartListEl = document.querySelector(".cart-wrapper");
  const checkOutBtn = document.querySelector(".checkout-btn")

  // inventory Render
  const renderInventory  = (inventories) => {
  let inventoryListInnerHtml = "";
  inventories.forEach(inventory => {
    inventoryListInnerHtml+= `<li id=${inventory.id}>
      <span class="item-name">${inventory.content}</span>
      <button class="inventory_remove_qty">-</button>
      <span class="amount">0</span>
      <button class="inventory_add_qty">+</button>
      <button class="add_to_cart">add to cart</button>
    </li>`
  });
  inventoryListEl.innerHTML = inventoryListInnerHtml;
  }

  // cart Render
  const renderCart  = (cartItems) => {
    let cartListInnerHtml = " ";
    cartItems.forEach(item => {
      cartListInnerHtml+= `<li id=${item.id}>
        <span class="item-name">${item.content}</span>
        <span> X </span>
        <span class="amount">${item.amount}</span>
        <button class="delete"> delete </button>
      </li>`
    });
    cartListEl.innerHTML = cartListInnerHtml;
    }

  return {
    renderInventory,
    renderCart,
    inventoryListEl,
    cartListEl,
    checkOutBtn
  };
})();

const Controller = ((model, view) => {
  // implement your logic for Controller
  const state = new model.State();

  const init = () => {
    state.subscribeInventory(() => {
      view.renderInventory(state.inventory);
    });
    state.subscribeCart(() => {
      view.renderCart(state.cart);
    });
    
    model.getInventory().then((data) => {
      state.inventory = data;
    });
    model.getCart().then((data) => {
      state.cart = data;
    });
  };
  const handleUpdateAmount = () => {
    view.inventoryListEl.addEventListener("click",(event) => {
      const element = event.target;
      if (element.className === "inventory_remove_qty") {
        const amountEl = element.parentElement.querySelector(".amount");
        let amount = parseInt(amountEl.innerHTML);
        if(amount>0){
          amount-=1;
        }
        amountEl.innerHTML = `${amount}`
      }
      else if (element.className === "inventory_add_qty") {
        const amountEl = element.parentElement.querySelector(".amount");
        let amount = parseInt(amountEl.innerHTML);
        amount+=1;
        amountEl.innerHTML = `${amount}`
      }
    });
  };

  const handleAddToCart = () => {
    view.inventoryListEl.addEventListener("click",(event) => {
      const element = event.target;
      if (element.className === "add_to_cart") {
        const amountEl = element.parentElement.querySelector(".amount");
        const id = element.parentElement.getAttribute("id");
        const item = element.parentElement.querySelector(".item-name");
        const amountToBeAdded = parseInt(amountEl.innerHTML);
        const itemName = item.innerHTML;
        if(amountToBeAdded!=0){
          let data = 
          {
            id:id, 
            content:itemName,
            amount:amountToBeAdded
          };
          let cartItems = [...state.cart]
          for(let i =0;i<cartItems.length;i++){
            if(cartItems[i].id==id){
              cartItems[i].amount+=amountToBeAdded;
              model.updateCart(id,cartItems[i].amount).then((data)=>{
                console.log(data);
              })
            return;
            }
          }
          model.addToCart(data).then((newItem)=>{
            console.log(newItem);
            state.cart = [...state.cart,newItem];
          });
        
          
        }
        
      }
    });
  };

  const handleDelete = () => {
    view.cartListEl.addEventListener("click",(event) => {
      const element = event.target;
      if (element.className === "delete") {
        const id = element.parentElement.getAttribute("id");
        let deletedList = [...state.cart];
        for(var i=0;i<deletedList.length;i++){
          if(deletedList[i].id == id){
            deletedList.splice(i,1);
            model.deleteFromCart(id);
            break;
          }
        }
        state.cart = [...deletedList];
      }
    })
  };

  const handleCheckout = () => {
    view.checkOutBtn.addEventListener("click",(event) => {
      model.checkout();
      state.cart=[];
    })

  };
  const bootstrap = () => {
    init();
    handleUpdateAmount();
    handleAddToCart();
    handleDelete();
    handleCheckout();
  };
  return {
    bootstrap,
  };
})(Model, View);

Controller.bootstrap();