import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/login.js";
import Main from "./pages/main.js";
import Register from "./pages/register";
import {useEffect} from "react";


function App() {
    return (
        <div style={{height: "100%"}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path={"/main"} element={<Main/>}/>
                    <Route path={"/register"} element={<Register/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
