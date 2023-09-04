import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/login.js";
import Main from "./pages/main.js";
import Register from "./pages/register";
import Statistics from "./pages/statistics";
import Audio from "./pages/audio";

function App() {
    return (
        <div style={{height: "100%"}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path={"/main"} element={<Main/>}/>
                    <Route path={"/register"} element={<Register/>}/>
                    <Route path={"/statistics"} element={<Statistics/>}/>
                    <Route path={"/audio"} element={<Audio/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
