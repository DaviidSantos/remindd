import { Outlet } from 'react-router-dom'
import Titlebar from './components/Titlebar.tsx'

function App() {
  return <div className="flex flex-col min-h-screen">
    <Titlebar />
    <Outlet />  
  </div>

}

export default App
