import { memo } from 'react'
import WeatherDashboard from './components/WeatherDashboard'
import './App.css'

const App = memo(function App() {
  return (
    <div className="App">
      <WeatherDashboard />
    </div>
  )
})

export default App

