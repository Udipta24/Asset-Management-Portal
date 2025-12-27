import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
//map container is roott component for a leaflet map in react,owns the map instance, means its the map itself

import { useState } from "react";
import API from "../../api/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
//L is global leaflet namespace now



//in many setups , react cannot find its fault marker images, so markers dont appear
//or brokwn image so console gives 404 errors
//happens because bundlers dont autopmaticaly copy leaflet image assets

//here getIconurl is internall leaflet method, compute icon urls automatically
//we delete leaflet default auto-resolution logic
//this forces leaflet to use our provided url

//l.icon.default.mergeoption overrides default marker icon configuration globally
//

//works if u comment below lines also but still 
//this is common in react leaflet, 
//you can also import images and put it here as the imported binding inplace of this url
//icoretinaurl-- used on retina display, high dpi phones and modern laptops, we still need it or blur icon
//iconurl-- used on standard displays, marker wouldnt show without this
//shadowurl-- shadow img below marker, can be ommited
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});


//usemapevents is a react leaflet hook, attaches leaflet event listeners to map
//like used to detect click etc and give response
//automatically cleaned up on unmount
//click(e) fires when useer clicks map, e is leaflet mouseveent
//has info like-- e.latlng---(lat,long)
//onpick(e.latlng) calls function passed from parent
//now sends the clicked coordinates upward 
//child to parent
//return null as this fucntion or component renders nothing
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    }
  });
  return null;
}

export default function RegionMapPicker({ onRegionSelected }) {
  const [point, setPoint] = useState(null);

  const confirm = async () => {
    const res = await API.post("/geo/resolve-region", {
      latitude: point.lat,
      longitude: point.lng
    });

    onRegionSelected(res.data.region); //the response from backend give the region name, 
    //and this prop which was passed from parent, updates the url and loads the assets.jsx page,the region is passed as prop
    
  };

  return (
    <div className="space-y-3">
      {/* mapcontainer is declarative react wrapper aorund leaflets map instance 
      center points to tripura, order is lat then long
      here  in clasName --- h-96 important as without height, the map will be blank
      
      tilelayer provides the actual map tiles / visual map, it defines where map images come from, without it
      map container renders but is blank. it uses openstreetmap as tile source,https://www.openstreetmap.org/#map=9/23.658/91.714
      s- subdomiain 
      z is zoom level, x and y are tile coordinates, leaflet replces them dynamically on pan or zoom


      onpick come from clickhandler , its defined by us, onpick==setpoint, when user clicks map, it updates react state "point"
      and react re render

      */}
      <MapContainer
        center={[23.8315, 91.2868]}
        zoom={12}
        className="h-96 w-full rounded"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onPick={setPoint} />
        
        {point && <Marker position={[point.lat, point.lng]} />}

        {/* before clicking, "point" is null so no marker then after clicking marker appears,not defined by us
        also button appears, as we see below */}

      </MapContainer>



      {point && (
        <button
          onClick={confirm}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Select this region
        </button>
      )}
    </div>
  );
}
