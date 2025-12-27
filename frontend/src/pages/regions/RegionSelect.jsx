import { useNavigate } from "react-router-dom";
import RegionMapPicker from "./RegionMapPicker";

export default function RegionSelect() {
  const nav = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Select Region from Map
      </h2>

      {/* {} can be removed , remove ; also if so*/}
      <RegionMapPicker
        onRegionSelected={(region) => {
          nav(`/regions/${region}/assets`);
        }}

        // navigation does not happen, we jsut passed function , it will work in child when its needed
        // example blue button appear and take u to page
      />
    </div>
  );
}

//well we seperate the componenets instead of one single file is because regionmap picker selects the region and this selects where to go
//so in future we can reuse the child in any other components to find the region the user has clicked,
//for eg this is for finding asset in a region, but we also to find vendors in a region or etc.
