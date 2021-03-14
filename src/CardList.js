import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from "uuid";
import "./CardList.css";

const CardList = () => {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [baseUrl,] = useState("https://deckofcardsapi.com/api/deck/");
  const [badDraw, setBadDraw] = useState(false);
  const [drawing, setDrawing] = useState(false);

  const timerId = useRef(null);

  const drawCard = async () => {
    try {
      const res = await axios.get(`${baseUrl}${deckId}/draw/?count=1`);
      setCards(cards => (
        [...cards, { id: uuid(), image: res.data.cards[0].image }]
      ));
      if (res.data.remaining === 0) {
        setBadDraw(true);
        toggleDraw();
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const toggleDraw = () => {
    setDrawing(drawing => !drawing);
  };

  // only when mounted, get a shuffled deck from the API and store its id
  useEffect(() => {
    axios.get(`${baseUrl}new/shuffle/`)
      .then(res => {
        // set state
        setDeckId(res.data.deck_id);
      })
      .catch(err => console.log(err));
  }, [baseUrl]);

  // if drawing is set, start interval to draw cards, otherwise stop interval
  useEffect(() => {
    if (drawing && !badDraw) {
      timerId.current = setInterval(async () => {
        await drawCard();
        return;
      }, 1000);
    }
    else {
      clearInterval(timerId.current);
    }
  }, [drawing, badDraw]);

  return (
    <>
      <div className="CardList-button">
        {
          badDraw ||
          <button onClick={ toggleDraw }>{ drawing ? "Stop drawing" : "Start drawing" }</button>
        }
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