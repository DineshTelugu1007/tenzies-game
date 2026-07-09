import React, { useEffect } from "react";
import "./App.css"
import Dice from"./Dice.jsx"
import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App(){

  const [IsdiceNumber,setDiceNumber]=useState(generateAllNewDice()); 
  const [rollcount,setRollCount]=useState(0);
  const buttonRef=useRef(null)
  const gameWon = IsdiceNumber.every(dice => dice.isHeld) && IsdiceNumber.every(dice => dice.value === IsdiceNumber[0].value)
  useEffect(()=>{
    if(gameWon){
      buttonRef.current.focus()
    }
  },[gameWon])
  function hold(id){
    setDiceNumber(oldDice=>oldDice.map(dice=>dice.id===id?{...dice, isHeld: !dice.isHeld } : dice))
  }

  function generateAllNewDice(){
   return Array(10).fill(0).map(()=> ({value:Math.ceil(Math.random()*6),isHeld:false,id:nanoid()}))
  }

  const diceElement=IsdiceNumber.map(diceObj => <Dice key={diceObj.id} value={diceObj.value} isHeld={diceObj.isHeld}
  hold={hold} id={diceObj.id}/>)

  function rolldice(){
  if (!gameWon){
    setRollCount(prevCount => prevCount + 1);

    setDiceNumber(oldDice => oldDice.map(dice=>{
      if(dice.isHeld){
        return dice
      }else{
        return{
          ...dice,
          value : Math.ceil(Math.random()*6)
        }
      }
    }))
  }else{
    setDiceNumber(generateAllNewDice())
    setRollCount(0)
  }
}

    return (
  <main>
    {gameWon && <Confetti />}

    <div aria-live="polite" className="sr-only">
      {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
    </div>

    <h1 className="title">Tenzies</h1>

    <p className="instructions">
      Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
    </p>

    {gameWon && (
      <p className="score">
        🎉 Your score: {rollcount} rolls
      </p>
    )}

    <div className="dice-container">
      {diceElement}
    </div>

    <button ref={buttonRef} className="roll" onClick={rolldice}>
      {gameWon ? "New Game" : "Roll"}
    </button>
  </main>
)
}