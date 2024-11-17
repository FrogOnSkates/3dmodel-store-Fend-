import React from 'react';
import './App.css';
import ModelList from './ModelList'; // Ensure this matches your file structure
import SpaceBG from './SpaceBG';

function App() {
  const handleAdminClick = () => {
    window.location.href = 'https://spacesauce3dmodelstore.sanity.studio/';
  };

  return (
    <div className="App">
      <SpaceBG />
      <button className="admin-button" onClick={handleAdminClick}>Admin</button>
      <h1>3D Model Store</h1>
      <main>
        <ModelList /> 
      </main>
    </div>
  );
}

export default App;
