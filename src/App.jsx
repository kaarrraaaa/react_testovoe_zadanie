import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("https://dev-su.eda1.ru/test_task/products.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("Ошибка при получении списка продуктов");
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении списка продуктов:", error);
      });
  }, []);

  const handleProductChange = (event) => {
    const selectedProductId = event.target.value;
    const selectedProduct = products.find(
      (product) => product.id === parseInt(selectedProductId)
    );
    setSelectedProduct(selectedProduct);
    setQuantity(1);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const existingCartItem = cart.find(
        (item) => item.product.id === selectedProduct.id
      );
      if (existingCartItem) {
        const updatedCart = cart.map((item) => {
          if (item.product.id === selectedProduct.id) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });
        setCart(updatedCart);
      } else {
        const cartItem = {
          product: selectedProduct,
          quantity: quantity,
        };
        setCart([...cart, cartItem]);
      }
      setSelectedProduct(null);
      setQuantity(1);
      const productSelect = document.getElementById("product");
      productSelect.value = "";
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleSaveOrder = () => {
    const orderData = cart.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    fetch("https://dev-su.eda1.ru/test_task/save.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(`Заказ сохранен под номером ${data.code}`);
          setCart([]);
        } else {
          alert("Ошибка при сохранении заказа");
        }
      })
      .catch((error) => {
        console.error("Ошибка при сохранении заказа:", error);
        alert("Произошла ошибка при сохранении заказа");
      });
  };

  return (
    <div className="container">
      <div className="order-form">
        <label htmlFor="product">Выбор продуктов:</label>
        <select name="product" id="product" onChange={handleProductChange}>
          <option value="">Выберите продукт</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
        <label htmlFor="quantity">Количество:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <button className="btn-add" onClick={handleAddToCart}>
          Добавить
        </button>
      </div>
      <table id="list-product">
        <thead>
          <tr>
            <th>Продукт</th>
            <th>Количество</th>
            <th>Цена</th>
            <th>Итоговая стоимость</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>{item.product.title}</td>
              <td>{item.quantity}</td>
              <td>{item.product.price}</td>
              <td>{item.product.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="3">Итого:</th>
            <td>{calculateTotalPrice()}</td>
          </tr>
        </tfoot>
      </table>
      <button className="btn-save" onClick={handleSaveOrder}>
        Сохранить
      </button>
    </div>
  );
}

export default App;
