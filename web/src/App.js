import React, {useState} from "react";
import { Layout } from 'antd';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import "./index.css";
import Head from "./Head";
import Body from "./Body";
import Foot from "./Foot";
import Detail from "./Detail";

const App = () => {
    const [bodyHeight] = useState(window.innerHeight-64-64);
    const [newEvent, setNewEvent] = useState(0);

    const newEventHandle = (ver) => {
        setNewEvent(ver);
    }

    return (
        <BrowserRouter>
            <Layout>
                <Head newEventCallBack={newEventHandle}/>

                <Routes>
                    <Route path='/' element={<Body windowHeight = {bodyHeight} newEventNotice={newEvent}/>} />
                    <Route path='/detail' element={<Detail windowHeight={bodyHeight}/>} />
                </Routes>
                
                <Foot />
            </Layout>
        </BrowserRouter>
    );
}
export default App;