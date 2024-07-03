import React, { useState } from 'react';
import Header from './Header';
import Card from './Card';

const Main = ({ cardsData, onDelete }) => {
  const [localCardsData, setLocalCardsData] = useState(cardsData);

  const handleDelete = (id) => {
    setLocalCardsData(localCardsData.filter(card => card.id !== id));
    onDelete(id); // Inform the parent component about the deletion
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="row">
          {localCardsData.map((card) => (
            <div className="col-md-4" key={card.id}>
              <Card imgSrc={card.imgSrc} name={card.name} id={card.id} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
