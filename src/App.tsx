import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import './components/components.css';

function App() {
  return (
    <div className="App">
      <Header title="ZeroToMarket" />
      <main className="App-header">
        <h1>ZeroToMarket</h1>
        <p>
          Your journey from zero to market starts here.
        </p>
        <div className="features">
          <div className="feature">
            <h3>Plan</h3>
            <p>Define your product vision and strategy</p>
          </div>
          <div className="feature">
            <h3>Build</h3>
            <p>Create your product with expert guidance</p>
          </div>
          <div className="feature">
            <h3>Launch</h3>
            <p>Take your product to market confidently</p>
          </div>
        </div>
        <a
          className="App-link"
          href="#"
          rel="noopener noreferrer"
        >
          Get Started
        </a>
      </main>
      <Footer />
    </div>
  );
}

export default App;
