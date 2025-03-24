import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FaSearch } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

const SearchPage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [radius, setRadius] = useState<number>(1); // in km
  const [mapLoaded, setMapLoaded] = useState(false);
  const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    defaultCenter
  );

  const circleRef = useRef<google.maps.Circle | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    setMapLoaded(true);
    mapRef.current = map;
  };

  const updateCircle = (loc: { lat: number; lng: number }) => {
    if (!mapRef.current) return;

    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    const newCircle = new window.google.maps.Circle({
      center: loc,
      radius: radius * 1000, // km to meters
      fillColor: "#FF914D",
      fillOpacity: 0.15,
      strokeColor: "#FF914D",
      strokeOpacity: 0.5,
      strokeWeight: 1,
      map: mapRef.current,
    });

    circleRef.current = newCircle;
  };

  const handleClick = async () => {
    if (!image && !location) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาใส่ข้อมูล",
        text: "โปรดเลือกรูปภาพของแมวหรือระบุตำแหน่งที่ต้องการค้นหา",
      });
      return;
    }

    navigate("/result", {
      state: {
        image,
        location,
        radius,
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (mapLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLocation);
          mapRef.current?.panTo(userLocation);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setMapCenter(defaultCenter);
          mapRef.current?.panTo(defaultCenter);
        }
      );
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (location) {
      updateCircle(location);
    }
  }, [radius]);

  return (
    <div className="h-full mb-20">
      <div className="flex justify-center items-start mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">ค้นหาแมวหาย</h1>
        </div>
      </div>
      <div className="max-w-6xl mx-auto bg-[#FFE9DB] shadow-md rounded-lg flex flex-col justify-between p-6">
        <div className="flex flex-col md:flex-row">
          {/* Left side: Upload */}
          <div className="flex flex-col justify-start items-center w-full md:w-1/2 p-6 space-y-2">
            <div className="w-full">
              <label className="text-[#FF914D] text-2xl font-semibold mb-4 block text-center">
                ค้นหาด้วยรูปภาพ
              </label>
              <label className="text-[#FF914D] block text-lg font-medium">
                อัพโหลดรูปภาพแมวของคุณ
              </label>
            </div>

            <div
              className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-300 shadow-sm bg-white flex items-center justify-center"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!image ? (
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-black mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16l4 4m0 0l4-4m-4 4V4m12 12l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <p className="text-black">Drag and Drop here</p>
                  <p className="text-black">or</p>
                  <label
                    htmlFor="fileUpload"
                    className="px-4 py-2 bg-[#FFE9DB] text-black rounded-lg cursor-pointer hover:bg-[#FFA864] transition"
                  >
                    Select File
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="w-full max-w-md h-[20rem] relative">
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute -top-3 -right-1 p-1 bg-white rounded-full text-red-500 text-3xl hover:text-red-600 transition z-10"
                    title="ลบรูปภาพ"
                  >
                    <IoIosCloseCircleOutline />
                  </button>

                  <label
                    htmlFor="fileUpload"
                    className="w-full h-full cursor-pointer block"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Selected"
                      className="w-full h-full object-contain"
                    />
                    <input
                      id="fileUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <div className="mt-auto p-2 text-black text-center">
                    {image.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side: Map */}
          <div className="flex flex-col justify-start items-start w-full md:w-1/2 p-6 pb-1 space-y-2">
            <div className="w-full">
              <label className="text-[#FF914D] text-2xl font-semibold mb-4 block text-center">
                ค้นหาด้วยตำแหน่ง
              </label>
              <div className="w-full">
                <label className="text-[#FF914D] block text-lg font-medium mb-2">
                  เลือกตำแหน่งบนแผนที่
                </label>
                <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                  <GoogleMap
                    onLoad={handleMapLoad}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={mapCenter}
                    zoom={15}
                    onClick={(e) => {
                      const newLocation = {
                        lat: e.latLng?.lat() ?? 0,
                        lng: e.latLng?.lng() ?? 0,
                      };
                      setLocation(newLocation);
                      updateCircle(newLocation);
                    }}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                      streetViewControl: false,
                    }}
                  >
                    {location && <Marker position={location} />}
                  </GoogleMap>
                </div>
                {location && (
                  <p className="mt-2 text-sm text-gray-600">
                    พิกัด: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between md:space-x-6 space-y-2 md:space-y-0">
              <label className="text-[#FF914D] text-lg font-medium whitespace-nowrap">
                รัศมีการค้นหา (กิโลเมตร)
              </label>
              <input
                type="number"
                min={0}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full md:flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="ระบุระยะทาง"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            onClick={handleClick}
            className="px-6 py-3 bg-[#FF914D] text-white font-bold rounded-xl hover:bg-[#FFA864] transition flex items-center justify-center"
          >
            <FaSearch className="h-full mr-2" />
            ค้นหา
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
