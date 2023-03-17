import React, { useState } from 'react';
import uniqid from 'uniqid';
import Card from './components/Card';
import Results from './components/Results';

export default function App() {
  const [cards, setCards] = useState([{balance: 0, limit: 0, usage: 0}]);
  const [totalCreditUsage, setTotalCreditUsage] = useState(0);
  const [showResults, setShowResults] = useState(false);


  const addCardField = (e) => {
    e.preventDefault();
    let newCard = {balance: 0, limit: 0, usage: 0};

    // Add new card object to cards array
    setCards(() => cards.concat(newCard));
  };


  const updateCard = (card, index) => { 
    // Original card values
    const balanceOG = cards[index].balance;
    const limitOG = cards[index].limit;

    setCards(() => {
      if (balanceOG !== card.balance || limitOG !== card.limit) {
        cards[index] = card;
      }
      return cards;
    });
  };


  // NOTE: Formula for percent usage -- balance * 100 / limit
  const handleCalculate = (e) => {
    e.preventDefault();
    // For tracking total credit usage
    let subtotals = {balance: 0, limit: 0}; 
    
    cards.forEach(card => {
      if (!card.limit) return; // Avoid dividing by zero

      // Calculate single card usage
      card.usage = ((card.balance * 100) / card.limit).toFixed(2);

      // Track total credit usage
      subtotals.balance += card.balance;
      subtotals.limit += card.limit;
    })

    // If fields are empty, throw error
    if (!subtotals.balance && !subtotals.limit) {
      // displayError
      return;
    }

    // Calculate total credit usage
    const total = ((subtotals.balance * 100) / subtotals.limit).toFixed(2);
    setTotalCreditUsage(total);

    // Display results
    setShowResults(true);
  };


  return (
    <div id='app'>
      <h1 className='mainHeader'>Credit Utilization Calculator</h1>
      <div className='calculator'>
        <form>
          {
            cards.map( (card, index) => {
              return (
                <Card 
                  card={card}
                  index={index}
                  import key={uniqid()}
                  update={updateCard}
                />
              )
            })
          }
        </form>
        <button className='addBtn' onClick={addCardField}>Add Card</button>
        <div className='buttonRow'>
          <button className='submit' onClick={handleCalculate}>Calculate</button>
        </div>
        {
          showResults ? 
          <Results totalUsage={totalCreditUsage} cards={cards}/>
          :
          null
        }
      </div>
    </div>
  );
}

