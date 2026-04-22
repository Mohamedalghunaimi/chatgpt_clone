import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
  import { ToastContainer, toast } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { useContext } from 'react';
import { context } from './pages/Provider';
import Credits from './pages/Credits';
import SuccessPage from './pages/SuccessPage';

function App() {
  const {isAuth,input} = useContext(context)
  return (
    <>
    <ToastContainer />
    {!isAuth?<>
    <Login />
    </>:<>
    <div className={`${input?"bg-black text-white":""}`}>
    <Routes>
      <Route path='/' element={<><Home/></>} />
      <Route path='/credits' element={<><Credits /></>} />
      <Route path='/loading' element={<><SuccessPage/></>} />
    </Routes>
    </div>
    </>}
    

    </>
  );
}

export default App;
