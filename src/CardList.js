import React, { useState, useEffect } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from "uuid";
import "./CardList.css";

const CardList = () => {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [baseUrl,] = useState("https://deckofcardsapi.com/api/deck/");
  const [cardsInDeck, setCardsInDeck] = useState(null);
  const [badDraw, setBadDraw] = useState(false);

  const drawCard = async function() {
    try {
      // first check if all cards have been drawn
      if (cards.length === cardsInDeck) {
        setBadDraw(true);
      }
      else {
        const res = await axios.get(`${baseUrl}${deckId}/draw/?count=1`);
        const image = res.data.cards[0].image;
        setCards(() => [...cards, { id: uuid(), image }]);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  // only when mounted, get a shuffled deck from the API and store its id
  useEffect(() => {
    axios.get(`${baseUrl}new/shuffle/`)
      .then(res => {
        // set state
        setDeckId(res.data.deck_id);
        setCardsInDeck(res.data.remaining);
      })
      .catch(err => {
        console.log(err);
      });
  }, [baseUrl]);

  return (
    <>
      <div className="CardList-button">
        <button onClick={ drawCard }>GIMME A CARD!</button>
      </div>
      {
        badDraw &&
        <div className="CardList-error">Error: no cards remaining!</div>
      }
      <div>
        { cards.map(card => <Card key={ card.id } image={ card.image } />) }
      </div>
    </>
  );
};

export default CardList;