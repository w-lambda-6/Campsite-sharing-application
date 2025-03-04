import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Row, Layout, Col, 
        Divider, Rate, Carousel, 
        Image, List, Typography, 
        Button, Modal, Input, message} from 'antd';
import Maps from "./Map";
import axios from 'axios';


const {Content} = Layout;
const {Paragraph, Text} = Typography;
const {TextArea} = Input;

const Detail = ({windowHeight}) => {
    const [searchParams] = useSearchParams();
    const [paramID, setParamID] = useState(searchParams.get("id"));
    const [camp, setCamp] = useState({title:"", rating:0, address:"", desc:"", comments:0, lat:0, lng:0, imgs:[], time:""});

    useEffect(()=>{
        const paramID = searchParams.get("id");
        getCampDetail(paramID);
    }, []);

    const getCampDetail = (id) => {
        axios.get('/api/detail', {params:{id:id}}).then((res)=>{
            if (res.data.code != 0){
                message.error(res.data.message);
                return;
            }
            setCamp(res.data.data);
        }).catch((error)=>{
            message.error(error.message);
        })
    };

    return (
        <Content style={{minHeight:windowHeight}}>
            <Row style={{marginTop:"20px"}}>
                <Col span={2}></Col>
                <Col span={11}>
                    <Description camp={camp}/>
                    <Divider plain>Latest Comments</Divider>
                    <Comments campID={searchParams.get("id")}/>
                </Col>
                <Col span={7} offset={2}>
                    <Divider plain>Images</Divider>
                    <Images imgs={camp.imgs}/>
                    <Divider plain>Location</Divider>
                    <Maps zoom={6} latlng={{lat:camp.lat, lng:camp.lng}}/>
                </Col>
                <Col span={2}></Col>
            </Row>
        </Content>
    );
}





const Description = ({camp}) => {
    return (
        <div>
            <Row><h1>{camp.title}</h1></Row>
            <Row style={{marginTop:"10px"}} sytle = {{lineHeight:"35px"}}>
                <Col span={6}><Rate disabled defaultValue={camp.rating} value={camp.rating}/></Col>
                <Col span={4}><span>AVG: {camp.rating}</span></Col>
                <Col span={4}>{camp.comments} Comments</Col>
                <Col offset={1}>Published {camp.time}</Col>
            </Row>
            <Row style={{marginTop:"10px"}}><h3>Location: {camp.address}</h3></Row>
            <Row style={{marginTop:"10px"}}><h3>Camp Description: </h3></Row>
            <Row style={{marginTop:"10px"}}><span>{camp.desc}</span></Row>
        </div>
    );
}




const Images = ({imgs}) => {
    return (
        <div>
            <Carousel autoplay style={{backgroundColor:`rgba(209,209,209,0.5)`, height:300, textAlign:"center"}}>
                {
                    // this was the old code that caused the trouble
                    //imgs.map((img, idx) =><Image key={idx} height={300} src={`http://localhost:8081/api/file?id=${img}`} />
                    Array.isArray(imgs) ? imgs.map((img, idx) =>
                        <Image key={idx} height={300} src={`http://localhost:8081/api/file?id=${img}`} />
                    ) : null
                }
            </Carousel>
        </div>
    );
}





const Comments = ({campID}) => {
    const [coms, setComs] = useState([]);

    useEffect(()=>{
        getCommentList(campID);
    }, [])

    const commentAddEventHandle = () => {
        getCommentList(campID);
    }

    const getCommentList = (id) => {
        axios.get("/api/comments", {params:{campID:id}}).then((res)=>{
            if (res.data.code != 0){
                message.error(res.data.message);
                return;
            }
            setComs(res.data.data);
        }).catch((error)=>{
            message.error(error.message);
        });
    };

    return (
        <div>
            <List 
                header={<CommentButton campID={campID} addEventCallbackFunc={commentAddEventHandle}/>}
                bordered
                size="small"
                dataSource={coms}
                renderItem={(item)=>(
                    <List.Item>
                        <Typography>
                            <Paragraph>
                                <span>User:{item.user}</span>
                                <span style={{marginLeft:"20px"}}>Rating: {item.rating}</span>
                                <span style={{marginLeft:"20px"}}>Time: {item.time}</span>
                            </Paragraph>
                            <Text>
                                {item.desc}
                            </Text>
                        </Typography>
                    </List.Item>
                )}
            />
        </div>
    );
}




const CommentButton = ({campID, addEventCallbackFunc}) => {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState("");
    const [rating, setRating] = useState(0);
    const [desc, setDesc] = useState("");

    const handleShowModal = () => {
        setUser("");
        setRating(0);
        setDesc("");
        setShow(true);
    }

    const handleCancelModal = () => {
        setShow(false);
    }

    const handleOkModal = () => {
        const param = {campID:campID, user:user, rating:rating, desc:desc};
        addCampComment(param);
    }

    const addCampComment = (param) =>{
        axios.post("/api/comment/add", param, {header:{"Content-Type":"application/json"}}).then((res)=>{
            console.log(res);
            if (res.data.code != 0){
                message.error(res.data.message);
                return
            }
            addEventCallbackFunc();
            setShow(false);
        }).catch((error)=>{
            message.error(error.message);
        })
    }

    return (
        <div>
            <Button type='primary' size='small' onClick={handleShowModal}>Comment</Button>
            <Modal title="Comment" open={show} onOk={handleOkModal} onCancel={handleCancelModal}>
                <Row>
                    <Col span={3}>User Name:</Col>
                    <Col span={18}><Input size='small' value={user} onChange={e=>{e.persist(); setUser(e.target.value);}}/></Col>
                </Row>
                <Row>
                    <Col span={3}>Rate:</Col>
                    <Col span={18}><Rate value={rating} onChange={setRating}/></Col>
                </Row>
                <Row>
                    <Col span={3}>Comment:</Col>
                    <Col span={18}><TextArea row={4} value={desc} onChange={e=>{e.persist(); setDesc(e.target.value);}}/></Col>
                </Row>
            </Modal>
        </div>
    );
}





export default Detail;