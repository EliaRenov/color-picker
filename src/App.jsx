import { useEffect, useState } from 'react'
import './App.css'
import Colors from './Colors'

function getRandomColor() {
  const keys = Object.keys(Colors);
  const randomNumber = Math.floor(Math.random() * keys.length)
  const randomKey = keys[randomNumber]
  const randomValue = Colors[randomKey]

  return {colorValue: randomKey, colorName: randomValue};
}

function getXColors(x, prev) {
  if (typeof x !== 'number' || 1 > x) return console.error('Input must be a positive number')

  let colors = [];
  for (let i = 0; i < x; i++) {
    colors.push(getRandomColor())
  }
  return colors
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const hexToRgb = (hex) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return {red: r, green: g, blue: b};
};

function decideTextColor(hex) {
  const { red, green, blue } = hexToRgb(hex)

  // luma test
  if ((red*0.299 + green*0.587 + blue*0.114) > 186) {
    return 'black'
  } else {
    return 'white'
  }
}

function JSXColors(array) {
  return array.map(color => {
    const { colorValue, colorName } = color
  
    return <div className="color"
     key={colorValue} 
     style={{backgroundColor: colorValue}}>

      <section className={`color-info ${decideTextColor(colorValue)}`}>
        <h2 className="color-value">
          {colorValue.slice(1)}
        </h2>
        <h3 className="color-name">
          {colorName}
        </h3>
      </section>

    </div>
  })
}

function App() {
  const [colorsState, setColorsState] = useState(getXColors(5))
  const [colorsNumState, setColorsNumState] = useState(5)

  function handleNewColors() {
    setColorsState(getXColors(colorsNumState))
  }

  function handleSpaceInput(e) {
    if (e.code === 'Space') handleNewColors()
  }

  function handleDecrement() {
    if (colorsNumState === 2) return;
    setColorsState(prev => prev.slice(1))
  }

  function handleIncrement() {
    if (colorsNumState === 5) return;
    setColorsState(prev => [...prev, getRandomColor()])
  }

  useEffect(() => {
    setColorsNumState(colorsState.length)
  }, [colorsState])



  return (
    <div className="container" tabIndex={0} onKeyDown={handleSpaceInput}>
      <header className="header">
        
        <button className="color-amount-btn decrement" onClick={handleDecrement}>-</button>
        <button className="new-colors-btn" onClick={handleNewColors}>Get New Colors</button>
        <button className="color-amount-btn increment" onClick={handleIncrement}>+</button>


      </header>
      <main className="main">
        {JSXColors(colorsState)}
      </main>
    </div>
  )
}

export default App
