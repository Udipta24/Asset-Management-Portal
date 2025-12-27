import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
const BACK_URL=import.meta.env.VITE_API_URL;
const BACKEND_URL=BACK_URL.replace(/\/api$/,"");  //remove /api
// for me,
// process.env.PORT in backend , frontend this


//forgot to add description
//add uploaded files preview and download later

export default function AssetDetail(){
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [attachments,setAttachments]=useState([]);//list of attachments
  const [dataChanged,setDataChanged]=useState(false);//to show images by re rendering after each upload

  //const [history, setHistory] = useState([]);

  // const [locations,setLocations] = useState([]);
  // const [newLocation, setNewLocation] = useState("");

  // const load = async () => {
  //   try {
  //     const res = await API.get(`/assets/${id}`);
  //     setAsset(res.data);
  //   } catch (err) {
  //       console.error(err);
  //     alert("Failed to load");
  //   }
  // };

  async function deleteAttachment(file) {
    const ok = window.confirm("Delete this file?");
    if (!ok) return;

    try {
      const endpoint =
        file.kind === "image"
          ? `/images/${file.id}`
          : `/pdfs/${file.id}`;

      await API.delete(endpoint);

      // refresh attachments
      const res = await API.get(`/meta/getallattachments/${id}`);
      setAttachments(res.data);

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }


  // const loadAttachments=async()=>{
  //   try{
  //     const res=await API.get("/meta/getallattachments");

  //   }
  // };


  //i forgot to put ID in it.....
  useEffect(()=>{
    API.get(`/meta/getallattachments/${id}`).then(res=>setAttachments(res.data));
  },[id,dataChanged]);

//id in dependency to fetch list for each new id, if i change id in url without it , it will be same page
  //fifle.mimetype is for backend only

  async function uploadFile(id,file){
    try{
      const formdata=new FormData();
      formdata.append("attachment",file);  //field name mismatch means backend has diff name
      let res;
      if(file.type==="application/pdf"){
        res=await API.post(`/pdfs/attachments/${id}`,formdata);
      }else if(file.type.startsWith("image/")){
        res=await API.post(`/images/attachments/${id}`,formdata);
      }else{
        alert("Unsupported type");
        return;//dont forget it
      }
      //const res=await data.json();
      
      alert(res.data.message);   //res={ data:{... message:...}, status:..., headers:....}  its res.data.message, dont use res.message
      setDataChanged(!dataChanged);
      // if(res){
      //   setAttachments(res.data);
      // }
    }catch(err){
      console.error(err);
      alert(err.response?.data?.message || "Upload Failed");
    }
  }

  //useEffect(()=>{ load(); }, [id]);
  //above react thinks synchronous

  useEffect(() => {
    async function fetchAsset() {
        try {
        const res = await API.get(`/assets/${id}`);
        setAsset(res.data);
        } catch (err) {
        console.error(err);
        alert("Failed to load");
        }
    }

    fetchAsset();
    }, [id]);    
    //order matters

    // useEffect(()=>{
    //   API.get("/meta/locations")
    //     .then(res=>setLocations(res.data))
    //     .catch(err=>console.error(err));
    // },[]);



    // useEffect(()=>{
    //   API.get(`/assets/${id}/history`)
    //   .then(res=>setHistory(res.data));
    // },[id]);
console.log(attachments);
console.log("BACKEND_URL =", BACKEND_URL);




  if (!asset) return <div className="text-center py-10 text-gray-500 animate-pulse">Loading...</div>;

   const statusColors = {
    active: "bg-green-100 text-green-700 border-green-300",
    "in-repair": "bg-yellow-100 text-yellow-700 border-yellow-300",
    retired: "bg-gray-200 text-gray-600 border-gray-300",
    scrapped: "bg-red-100 text-red-700 border-red-300",
  };  

  return (
    <div className="bg-white bg-gradient-to-tr from-amber-100 via-cyan-200 to-amber-200 p-6 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">

        <h2 className="text-2xl font-semibold">{asset.asset_id}. {asset.asset_name}</h2>

        <span
          className={`px-3 py-1 rounded-full text-sm border ${statusColors[asset.status]}`}
        >
          {asset.status.replace("-", " ").toUpperCase()}
        </span>
      </div>

      {/* Asset Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
            General Info
          </h3>
          <p><strong>Model:</strong> {asset.model_number || "-"}</p>
          <p><strong>Serial:</strong> {asset.serial_number || "-"}</p>
          <p><strong>Category:</strong> {asset.category_name || "-"}</p>
          <p><strong>Subcategory:</strong> {asset.subcategory_name || "-"}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
            Purchase Details
          </h3>
          <p><strong>Vendor:</strong> {asset.vendor_name || "-"}</p>
          <p><strong>Cost:</strong> ₹{asset.purchase_cost || "-"}</p>
          <p><strong>Purchased On:</strong> {asset.purchase_date || "-"}</p>
          <p><strong>Warranty Expiry:</strong> {asset.warranty_expiry || "-"}</p>
        </div>

        {/* Location Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
            Location
          </h3>

          <p>
            <strong>Name:</strong> {asset.location_name || "-"}
          </p>

          <p>
            <strong>Region:</strong> {asset.region || "-"}
          </p>

          <p>
            <strong>Latitude:</strong>{" "}
            {asset.latitude ? asset.latitude : "-"}
          </p>

          <p>
            <strong>Longitude:</strong>{" "}
            {asset.longitude ? asset.longitude : "-"}
          </p>
        </div>

      </div>


      

      {asset.latitude && asset.longitude && (
        <a
          href={`https://www.google.com/maps?q=${asset.latitude},${asset.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline mt-2 inline-block"
        >
          View on Map
        </a>
      )}


      {/*ignore */}
      {/* <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Asset Lifecycle</h3>

        {history.length === 0 ? (
          <p className="text-gray-500">No lifecycle history</p>
        ) : (
          <ul className="space-y-3">
            {history.map((h, i) => (
              <li key={i} className="border-l-4 border-blue-500 pl-3">
                <div className="text-sm">
                  <strong>{h.old_location || "N/A"}</strong> →{" "}
                  <strong>{h.new_location}</strong>
                </div>
                <div className="text-xs text-gray-500">
                  By {h.changed_by} • {new Date(h.change_date).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div> */}

        
                  {/* ATTACHMENTS */}
                  {attachments && attachments.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-lg border-b text-gray-800 font-semibold">Attachments</h2>

                    <div className="flex flex-wrap gap-3 mt-2">   {/*flex so that we can bring elements side by side and flex wrap to put elements below when size of screen is small */}
  
                      {attachments.map((file) => (
                        //div has (image/pdf--dowload )--delete so flex col 
                        <div key={`${file.kind}-${file.id}`} className="flex flex-col items-center gap-2">

{/* //image/ put "/" ,,,ok so now the url encoding problem , my file name has special character like #,treating as anchor or url fragments, which gets cut off and image dont show.
// to fix it forever, i got to upload config file and added safename
// key={`${file.kind}-${file.id}`} without it , there can be same id of both pdf and image table which may cause unwanted things*/}

                          {file.file_type.startsWith("image/") && (
                            // download button and images
                            <div className="flex flex-col items-center gap-1">

                              {/* ✅ IMAGE PREVIEW IN SAME TAB */}
                              {/* shows a 20x20 thumbnail object-cover helps maintain aspect ratio, then cursor-pointers changes cursor to hand
                              on clicking- opens full image in new tab as we used _blank

                              for download link , we applied style to download word inside a tags, 
                              its downloaded via backend, so thats authentication and authorization is checked

                              in src, browser sends get request to this url in backend, and server gives it
                              <img> dont start on new line , sits between words, inline replace element

                              window.open(url,target) , we use a tags also , hover changes size of image

                              //<img> align to text baseline, not bottom */}

                              <img
                                src={`${BACKEND_URL}${encodeURI(file.file_path)}`}
                                className="h-20 w-20 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                                alt={file.file_name}
                                onClick={() => window.open(`${BACKEND_URL}${encodeURI(file.file_path)}`,"_blank")}
                              />
                              {/* encodeuri dont work here , just ignore,, its &{file.file_path} only */}

                              {/* DOWNLOAD IMAGE */}
                              <a
                                href={`${BACKEND_URL}/api/${file.kind === "image" ? "images" : "pdfs"}/download/${file.id}`}
                                className="text-xs text-blue-600 underline"
                              >
                                ⬇ Download
                              </a>


                            </div>
                          )}

                          {/* only one of this condition runs , if pdf then below renders, if image/ then above renders */}
                          {file.file_type === "application/pdf" && (
                            <div className="flex flex-col items-center gap-1">

                              {/* OPEN PDF IN NEW TAB */}
                              {/* we navigate to backend url ,on clicking browser sends get request

                              dont forget to use backend or it will use 5173 url

                              noopner noreferrer exists as opened page can redirect ur site, steal data, perform phishing attack
                              noopener---prevents new tabs from accessing window.opener 
                              noreferrer--hides page url from opened site,prevents sending Referer header */}
                              

                              <a
                                href={`${BACKEND_URL}${file.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded-md"
                              >
                                📄 Open PDF
                              </a>

                              {/* we are forcing download here, browser just knows to display but we need to make it force download,
                              i clicked and it was taking me to preview everytime so add force download
                              we could use <a href="file.pdf" download>but its bad for protected files */}

                              {/* DOWNLOAD PDF */}
                              <a
                                href={`${BACKEND_URL}/api/${file.kind === "image" ? "images" : "pdfs"}/download/${file.id}`}
                                className="text-xs text-blue-600 underline"
                              >
                                ⬇ Download
                              </a>
                                

                            </div>
                          )}

                          <button onClick={()=>deleteAttachment(file)} className="text-xs text-red-600 hover:underline flex flex-col ">Delete</button>


                        </div>
                      ))}
                    </div>
                    </div>
                  )}

       
      {/* Upload Section */}

      
                  <div className=" mt-10 flex items-center gap-3">
                    <label className="px-4 py-2 text-sm text-red-50 bg-blue-500 rounded-lg cursor-pointer border hover:bg-blue-800 text-center">
                      📎 Upload
                      <input className=""
                        type="file"
                        accept="image/*,application/pdf"
                        hidden
                        onChange={(e) => uploadFile(id, e.target.files[0])}
                      />
                    </label>
                  </div>
                  



      {/* <div className="mt-10 bg-gray-50 p-5 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-3">Upload Document</h3>

        <div className="w-full max-w-2xl">
          <FileUpload assetId={asset.asset_id} onUploaded={load} />
        </div>
      </div>*/}
    </div> 
  );
}

{/* 
// ✅ The problem is NOT in the form.

// The real cause is this container:

// <div className="w-full md:w-1/2">
//   <FileUpload ... />
// </div>

// ❌ On medium screens (md:), you are forcing the upload form into only 50% width.
// This is too narrow → the file input + button cannot fit → overflow happens



// w-full → takes full available width

// max-w-2xl → prevents it from becoming too wide on large screens

// No md:w-1/2 → no artificial shrinking, no overflow */}
