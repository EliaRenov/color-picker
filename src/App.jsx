import { useEffect, useState } from 'react'
import './App.css'
import Colors from './Colors'
import ClosedLock from './assets/closed-lock.png'
import OpenLock from './assets/open-lock.png'

function getRandomColor() {
  const keys = Object.keys(Colors);
  const randomNumber = Math.floor(Math.random() * keys.length)
  const randomKey = keys[randomNumber]
  const randomValue = Colors[randomKey]

  return {colorValue: randomKey, colorName: randomValue, locked: false};
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

function getXColors(x, prev = [{}, {}, {}, {}, {}]) {
  if (typeof x !== 'number' || 1 > x) return console.error('Input must be a positive number')

  let colors = [];
  for (let i = 0; i < x; i++) {
    if (prev[i].locked) {
      colors.push(prev[i])
    } else {
      colors.push(getRandomColor())
    }
  }
  return colors
}

function toggleColor(e, setColorsState) {
  const colorName = e.target.getAttribute('color')

    setColorsState(prev => {
      const index = prev.indexOf(prev.find(x => x.colorName === colorName))

      let newState = [...prev]
      newState[index].locked = !newState[index].locked
      
      return newState
    })

}

function JSXColors(array, setColorsState) {
  return array.map(color => {
    const { colorValue, colorName } = color

    return <div className="color"
     key={colorValue} name={colorName}
     style={{backgroundColor: colorValue}}>

      <section className={`color-info ${decideTextColor(colorValue)}`}>
        
        {color.locked && 
          < img className="lock closed-lock" src={ClosedLock} alt="closed lock icon" onClick={(e) => toggleColor(e, setColorsState)} color={colorName} style={{filter: decideTextColor(colorValue) === 'white' && 'invert(1)'}} />}
        {!color.locked &&
          <img className="lock open-lock" src={OpenLock} alt="open lock icon" onClick={(e) => toggleColor(e, setColorsState)} color={colorName} style={{filter: decideTextColor(colorValue) === 'white' && 'invert(1)'}} />}
        
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
    setColorsState((prev) =>
      getXColors(colorsNumState, prev)
    )
  }

  function handleSpaceInput(e) {
    if (e.code === 'Space') handleNewColors()
  }

  function handleDecrement() {
    if (colorsNumState === 2) return;
    setColorsState(prev => prev.slice(1))
  }

  function handleIncrement() {
    if (colorsNumState === 10) return;
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
      <main className="main" style={{gridTemplateColumns: `repeat(${colorsNumState}, 1fr)`}}>
        {JSXColors(colorsState, setColorsState)}
      </main>
    </div>
  )
}

export default App
