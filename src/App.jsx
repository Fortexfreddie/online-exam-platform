import Examly from './components/Examly';
import { Routes, Route } from "react-router";
import Signup from './components/Signup';
import Login from './components/Login';
import Cbt from './components/cbt';


function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Examly />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/cbt' element={<Cbt />} />
      </Routes>  
    </div> 
  )
}

export default App
