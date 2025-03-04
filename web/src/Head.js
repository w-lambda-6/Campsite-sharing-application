import React, {useState} from "react";
import { Header } from "antd/es/layout/layout";
import {Menu} from "antd";
import New from "./New";
import {useNavigate} from 'react-router-dom'

const Head = ({newEventCallBack}) => {
    const [menus, setMenus] = useState([{title:"Campgrounds", path:"/"}, {title:"About", path:"/"}]);
    const navigate = useNavigate()

    const MenuClick = (event)=>{
        navigate(event.item.props.path);
    }

    return(
            <Header style={{ 
                backgroundColor: 'red'
            }}> 
                <div style={{
                    color:"white", fontSize:"35px", 
                    float:"left", width:"120px", 
                    display:"block", fontWeight: "bold"
                }}> YelpCamp </div> 

                <div style={{
                    marginLeft:"50px",
                    float:"left",
                    display:"block",
                    width:"400px"
                }}>
                    <Menu style={{
                        backgroundColor:"transparent",
                        fontSize:"16px",
                        color:"rgba(255,255,255,.55)",
                        fontWeight:"bold"
                    }}
                    mode = "horizontal"
                    defaultSelectedKeys = {['Campground']}
                    items = {menus.map((item)=>{
                        const key = item.title;
                        return {key, label: `${item.title}`, path:item.path};
                    })}
                    onClick={MenuClick}
                    />
                </div>
                <New newEvent = {newEventCallBack}/>
            </Header>
    );
}
export default Head;