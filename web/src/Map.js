import { unstableSetRender } from "antd";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";

const Maps = ({latlng, zoom, onClick=undefined, moveable=false}) => {
    const [key] = useState("AIzaSyDZStyJrpj-7djKpRr_SmgXVG4UymQlCgE");

    const [inLatLng, setLatLng] = useState(latlng);
    const [inZoom, setZoom] = useState(zoom);

    // everytime the latlng value changes then we apply the function to 
    // to also change the corresponding inlatlng value, so that it will always be updated
    useEffect(()=>{
        setLatLng(latlng);
    },[latlng]);

    const handleOnClick = ({x, y, lat, lng, event}) => {
        if (moveable){
            setLatLng({lat:lat, lng:lng});
        }
        if (onClick){
            onClick(lat, lng);
        }
    }

    return (
        <div style={{height:'300px'}}>
            <GoogleMapReact
                onClick={handleOnClick}
                bootstrapURLKeys={{key}}
                center = {inLatLng}
                defaultZoom={inZoom}
            >
                <ReactMapPointComponent 
                    lat={inLatLng.lat}
                    lng={inLatLng.lng}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
}


const ReactMapPointComponent = () => {
    const markerStyle={
        border:'1px solid white',
        borderRadius: '50%',
        height:10,
        width:10,
        backgroundColor:'red',
        cursor:'pointer',
        zIndex:10,
    };

    return (
        <div style={markerStyle}/>
    );
}

export default Maps