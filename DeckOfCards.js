import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card";

const BASE_URL = "https://deckofcardsapi.com/api/deck/"


const DeckOfCards = () => {
  const [deck, setDeck] = useState(null)
  const [drawnCard, setDrawnCard] = useState([])
  const [draw, setDraw] = useState(false)
  const timerRef = useRef(null)

  // get a new, shuffled deck of cards
  useEffect(() => {
    async function getDeck() {
      let res = await axios.get(`${BASE_URL}/new/shuffle`)
      setDeck(res.data);
    }
    getDeck();
  }, [setDeck])

  useEffect(() => {
    async function getCard() {
      let {deck_id} = deck

      try{
        let res = await axios.get(`${BASE_URL}/${deck_id}/draw`)

        //if # of cards = 0, throw error
        if(res.data.remaining ===0){
          throw new Error ("No cards remaining")
        }

        const card = res.data.cards[0]

        setDrawnCard(data => [
          ...data,
          {
            id: card.code,
            name: card.value + " OF " + card.suit,
            image: card.image
          }
        ])
      } catch (err) {
        alert(err);
      }
    }

    if(draw && !timerRef.current){
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [draw, setDraw, deck])

  const toggleDraw = () => {
    setDraw(auto => !auto);
  };

  const cards = drawnCard.map(c => (
    <Card key={c.id} name={c.name} image= {c.image} />
  ))

  return (
    <div>
      {deck ? (
      <button onClick={toggleDraw}>
        {draw ? "STOP" : "KEEP"} DRAWING
      </button>
      ) : null}
      <br/>
      <br/>
      <br/>
      <div>{cards}</div>
    </div>
  )
}

export default DeckOfCards;