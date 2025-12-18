import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";


const redIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});


const serviceLocations = [
  { name: "Dhaka", lat: 23.8103, lng: 90.4125 },
  { name: "Chittagong", lat: 22.3569, lng: 91.7832 },
  { name: "Khulna", lat: 22.8456, lng: 89.5403 },
  { name: "Rajshahi", lat: 24.3636, lng: 88.6241 },
  { name: "Sylhet", lat: 24.8949, lng: 91.8687 },
  { name: "Barishal", lat: 22.7010, lng: 90.3535 },
  { name: "Mymensingh", lat: 24.7471, lng: 90.4203 },
  { name: "Rangpur", lat: 25.7439, lng: 89.2752 },
  { name: "Comilla", lat: 23.4600, lng: 91.1800 },
];


const FlyMarker = ({ position, name }) => {
  const map = useMap();

  const handleClick = () => {
    map.flyTo(position, 9, { duration: 1 }); 
  };

  return (
    <Marker
      position={position}
      icon={redIcon}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>{name}</Popup>
    </Marker>
  );
};

const BangladeshMap = () => {
  return (
    <MapContainer
      center={[23.685, 90.3563]}
      zoom={7}
      style={{ height: "500px", width: "mx-auto" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {serviceLocations.map((loc, idx) => (
        <FlyMarker
          key={idx}
          position={[loc.lat, loc.lng]}
          name={loc.name}
        />
      ))}
    </MapContainer>
  );
};

export default BangladeshMap;
