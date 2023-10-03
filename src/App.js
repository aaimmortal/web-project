import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/login.js";
import Main from "./pages/main.js";
import Register from "./pages/register";
import Statistics from "./pages/statistics";
import Agent from "./pages/agent";


function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path={"/main"} element={<Main/>}/>
                    <Route path={"/register"} element={<Register/>}/>
                    <Route path={"/statistics"} element={<Statistics/>}/>
                    <Route path={"/agents"} element={<Agent/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
