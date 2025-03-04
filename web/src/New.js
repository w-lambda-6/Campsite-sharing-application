import React, { useState } from "react";
import {PlusOutlined} from "@ant-design/icons";
import { Button, Modal, Row, Col, Input, Rate, Upload, message } from "antd";
import Map from "./Map";
import axios from "axios";

const {TextArea} = Input;


const getBase64 = (file) => new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
})


const New = ({newEvent}) => {
    const [show, setShow] = useState(false);
    const [ver, setVer] = useState(0);

    // for information in the modal to be updated
    const [user, setUser] = useState("");
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [picList, setPicList] = useState([]);
    const [desc, setDesc] = useState("");

    // for uploading images and image preview
    const [maxUploadPicNum] = useState(6);
    const [imagePreviewShow, setImagePreviewShow] = useState(false);
    const [imagePreviewTitle, setImagePreviewTitle] = useState('');
    const [imagePreviewSrc, setImagePreviewSrc] = useState('');

    const handleMapClick = (lat, lng) => {
        setLat(lat);
        setLng(lng);
    };

    const handleShowModal = () => {
        // clear the modal of previous input content 
        // if there is any
        setUser("")
        setTitle("");
        setRating(0);
        setAddress("");
        setLat(0);
        setLng(0);
        setPicList([]);
        setDesc("");

        setShow(true);
    }

    const handleOnOK = () => {
        const param = {
            user : user,
            title : title,
            rating : rating,
            address : address,
            lat : lat,
            lng : lng,
            imgs : picList.map(item=>item.response.data.id),
            desc : desc,
        };
        addCamp(param);
    }

    const handleOnCancel = () => {
        setShow(false);
    }


    const addCamp = (param) =>{
        axios.post("/api/camp/add", param, {header:{"Content-Type":"application/json"}}).then((res)=>{
            if(res.data.code !=0){
                message.error(res.data.message);
                return;
            }
            message.success("Campsite added successfully!");

            // make it dynamic so that call backs can actually adjust 
            // to input and the current state of the program
            newEvent(ver+1);
            setVer(ver+1);
            setShow(false);
        }).catch((error)=>{
            message.error(error.message);
        });
    }


    const uploadImagePreviewHandle = async (file) => {
        if(!file.url && !file.preview){
            file.preview = await getBase64(file.originFileObj);
        }
        setImagePreviewSrc(file.url||file.preview);
        setImagePreviewShow(true);
        setImagePreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/')+1));
    }
    const imagePreviewShowCancel = () => { setImagePreviewShow(false)}


    const uploadImageHandle = ({file, fileList, event}) =>{
        if (file.status == "uploading"){
            message.success("Uploading, please wait", 1);
            setPicList(fileList);
        }
        if (file.status == "done"){
            message.success("Upload successful!", 1);
            setPicList(fileList);
        }
        if (file.status == "removed"){
            const list = fileList.filter(item=>item.uid!=file.uid);
            setPicList(list);
        }
        if (file.status=="error"){
            message.error("Upload failed, please retry", 1);
            const list = fileList.filter(item=>item.uid != file.uid);
            setPicList(fileList);
        }
    }


    const UploadButton = (
        <div>
            <PlusOutlined />
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );


    return (
        <div style={{float:"right", display:"block", width:"100px"}}>
            <Button style={{
                backgroundColor:"transparent",
                color:"rgba(255,255,255)"
            }}
            size = "large"
            onClick={handleShowModal}
            >New</Button>

            <Modal width={"800px"} title="Share" open={show} onOk={handleOnOK} onCancel={handleOnCancel}>
                <Row span={3}><Col>Shared by: </Col></Row>
                <Row><Col span={24}><Input size = "samll" value={user} onChange={e=>{e.persist(); setUser(e.target.value);}}/></Col></Row>

                <Row span={3}><Col>Title: </Col></Row>
                <Row><Col span={24}><Input size = "samll" value={title} onChange={e=>{e.persist(); setTitle(e.target.value);}}/></Col></Row>

                <Row span={3}><Col>Rate: </Col></Row>
                <Row><Col span={24}><Rate value={rating} onChange={setRating}/></Col></Row>

                <Row span={3}><Col>Address: </Col></Row>
                <Row><Col span={24}><Input size = "samll" value={address} onChange={e=>{e.persist(); setAddress(e.target.value);}}/></Col></Row>

                <Row span={3}><Col>Location Info: </Col></Row>
                <Row><Col span={24}><Map latlng={{lat:lat, lng:lng}} zoom={6} moveable={true} onClick={handleMapClick}/></Col></Row>

                <Row span={3}><Col>Images: </Col></Row>
                <Row><Col span={24}>
                    <Upload
                        // have to write the entire URL, as just a normal action and didn't use axios
                        action="http://localhost:8081/api/upload"
                        listType="picture-card"
                        fileList = {picList}
                        onPreview={uploadImagePreviewHandle}
                        onChange={uploadImageHandle}
                    >
                        {picList?.length>=maxUploadPicNum ? null : UploadButton}
                    </Upload>
                </Col></Row>

                <Row span={3}><Col>Description: </Col></Row>
                <Row><Col span={24}><TextArea rows={4} placeholder="Max 200 chars including white spaces and punctuation" maxLength={200} value={desc} onChange={e=>{e.persist(); setDesc(e.target.value);}}/></Col></Row>
            </Modal>
            <Modal open={imagePreviewShow} title={imagePreviewTitle} footer={null} onCancel={imagePreviewShowCancel}>
                <img alt = "pic" style = {{width:'100%'}} src={imagePreviewSrc}/>
            </Modal>
        </div>
    );
}

export default New;