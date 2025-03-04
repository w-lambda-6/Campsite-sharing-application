import React, {useState, useEffect} from "react";
import { Layout, List, Card, Rate, message } from "antd";
import { Link } from "react-router-dom";
import axios from 'axios';

const {Content} = Layout;
const {Meta} = Card;

// body component
const Body = ({windowHeight, newEventNotice}) => {
    return(
        <Content style={{minHeight:windowHeight}}> 
            <Camps newNotice={newEventNotice}/>
        </Content>
    );
}

// camping site list component
const Camps = ({newNotice}) => {
    const [camps, setCamps] = useState([]);

    // this means every time we load the page, we do the actions in the function
    useEffect(()=>{
        getCamps();
    }, [newNotice]);

    // get campsite data on first page
    const getCamps = () => {
        axios.get('/api/campList', {params:{}}).then((res)=>{
            if (res.data.code!=0){
                message.error(res.data.message);
                return;
            }
            setCamps(res.data.data);
        }).catch((error)=>{
            message.error(error.message);
        });
    };

    return (
        <div style={{marginLeft:"65px", marginTop:"20px"}}>
            <List 
                grid={{column:4}}
                dataSource={camps}
                renderItem={(item)=>(
                    <List.Item>
                        <Link target="_blank" to={{pathname:`/detail`, search:`id=${item.id}`}}>
                            <Card
                                style={{width:300}}
                                cover={<img style={{height:"180px", width:"300px"}}src={`http://localhost:8081/api/file?id=${item.imgs[0]}`}/>}
                            >
                                <Rate disabled defaultValue={item.rating}/>
                                <Meta title={item.title} description={`${item.desc.substring(0,16)}...`}/>
                            </Card>
                        </Link>
                    </List.Item>
                )}
            />
        </div>
    );
}
export default Body;