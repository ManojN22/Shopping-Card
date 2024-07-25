# Shopping Cart Project

This project is a simple shopping cart application built using HTML, CSS, and JavaScript following the MVC (Model-View-Controller) design pattern. It provides a user-friendly interface to browse products, add them to the cart, and view the cart's contents.

## Files

- `index.html`: The main HTML file that includes the basic structure and layout of the shopping cart interface.
- `css/styles.css`: The CSS file for styling the shopping cart interface.
- `js/index.js`: Contains the Model, View, and Controller parts of the MVC pattern, managing the data, presentation, and business logic.

## Installation

1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/yourusername/shopping-cart.git
    ```
2. Navigate to the project directory:
    ```sh
    cd shopping-cart
    ```
3. To run the app:
    ```sh
    npm start
    ```


## Screenshots

### Desktop View

![Desktop View](https://github.com/ManojN22/Shopping-Card/blob/main/public/shopping-cart.png)


### Mobile View

![Mobile View](https://github.com/ManojN22/Shopping-Card/blob/main/public/shopping-cart-mobile.png)

## MVC Structure

### Model, View, and Controller (`js/index.js`)

The Model handles the data and business logic of the application. It stores the list of products and the contents of the shopping cart.

The View is responsible for displaying the user interface and updating the DOM based on the current state of the Model. It listens for user interactions and communicates them to the Controller.

The Controller acts as an intermediary between the Model and the View. It handles user input, updates the Model, and instructs the View to update the UI accordingly.
