import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import CoinDetail from './pages/CoinDetail'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/coin/:id' element={<CoinDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App