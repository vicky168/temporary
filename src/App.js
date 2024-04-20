import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      onLogin();
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="login-container">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    // Username validation
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      setError('Username can only contain letters and numbers');
      return;
    }
  
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userExists = registeredUsers.find((u) => u.username === username);
  
    if (userExists) {
      setError('Username already exists');
    } else {
      const newUser = { username, password };
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      onRegister();
      setError('');
    }
  };
  

  return (
    <div className="auth-container">
      <div className="register-container">
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Enter a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="button-container">
            <button type="submit">Register</button>
            <Link to="/login" className="register-link">Login Here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Home({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleProducts] = useState(6);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>store-project App</h1>
      <div class='rbord'>
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search for products titles ...'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className='grid product-grid'>
        {filteredProducts.slice(0, visibleProducts).map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className='product-card'>
            <div>
              <img src={product.image} alt={product.title} className='product-image-home' />
              <div class='product-details-home'>
                <p class='product-title-home'>{product.title}</p>
                <p class='product-price-home'>${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
}

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${productId}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product details: ', error));
  }, [productId]);

  return (
    <div>
      <h1>Product Page</h1>
      <div class='rbord-pro'> 
      <div className='product-page'>
        {product && (
          <>
            <img src={product.image} alt={product.title} className='product-image' />
            <div className='product-details'>
              <h2 className='product-title'>{product.title}</h2>
              <p className='product-price'>${product.price}</p>
              <p className='product-description'>{product.description}</p>
              <p className='product-rating'>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>
            </div>
          </>
        )}
      </div>
    </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home products={products} />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}

export default App;