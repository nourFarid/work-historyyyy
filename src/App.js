import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import CardDetails from './components/CardDetails';
import NewCard from './components/NewCard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cardsData, setCardsData] = useState([
    { id: 1, imgSrc: 'https://via.placeholder.com/150', name: 'Card 1' },
    // { id: 2, imgSrc: 'https://via.placeholder.com/150', name: 'Card 2' },
    // { id: 3, imgSrc: 'https://via.placeholder.com/150', name: 'Card 3' },
  ]);

  const handleAddCard = (card) => {
    setCardsData([...cardsData, card]);
  };

  const handleUpdateCard = (id, updatedCard) => {
    setCardsData(cardsData.map(card => (card.id === id ? updatedCard : card)));
  };

  const handleDeleteCard = (id) => {
    setCardsData(cardsData.filter(card => card.id !== id));
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main cardsData={cardsData} onDelete={handleDeleteCard} />} />
          <Route path="/card/:id" element={<CardDetails cardsData={cardsData} onUpdate={handleUpdateCard} />} />
          <Route path="/new-card" element={<NewCard onAdd={handleAddCard} />} />
          <Route path="/new-card" element={<NewCard onAdd={handleAddCard} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
