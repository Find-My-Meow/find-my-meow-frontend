import { useNavigate } from "react-router-dom";
import DefaultButton from "../components/DefaultButton";
import { GoogleMap, OverlayView } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
interface Post {
  user_id: string;
  post_id: string;
  cat_name?: string;
  gender: string;
  color: string;
  breed: string;
  cat_marking: string;
  location: {
    latitude: number;
    longitude: number;
  };
  lost_date?: string;
  other_information?: string;
  cat_image: {
    image_id: string;
    image_path: string;
  };
  post_type: string;
  email_notification: boolean;
  user_email: string;
  status: string;
}
const HomePage = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(1); // in km
  const [mapLoaded, setMapLoaded] = useState(false);
  const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(defaultCenter);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const handleClick = () => {
    navigate("/lost-cat");
  };
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const [lostRes, foundRes, adoptionRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/?post_type=lost`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/?post_type=found`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/?post_type=adoption`),
        ]);

        const [lost, found, adoption] = await Promise.all([
          lostRes.json(),
          foundRes.json(),
          adoptionRes.json(),
        ]);

        setPosts([...lost, ...found, ...adoption]);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchAllPosts();
  }, []);

  console.log(posts)

  const updateCircle = (loc: { lat: number; lng: number }) => {
    if (!mapRef.current) return;

    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    const newCircle = new window.google.maps.Circle({
      center: loc,
      radius: radius * 1000,
      fillColor: "#FF914D",
      fillOpacity: 0.15,
      strokeColor: "#FF914D",
      strokeOpacity: 0.5,
      strokeWeight: 1,
      map: mapRef.current,
    });

    circleRef.current = newCircle;
  };

  const handleMapLoad = (map: google.maps.Map) => {
    setMapLoaded(true);
    mapRef.current = map;
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
    <div className="w-full h-fit px-4 py-10">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-20 max-w-6xl mx-auto">
        {/* Left Section: Text and Button */}
        <div className="text-center lg:text-left">
          <div className="font-paytone text-4xl sm:text-5xl md:text-6xl lg:text-7xl py-2 leading-tight whitespace-nowrap">
            <span className="text-primary">Find</span>{" "}
            <span className="text-neutral">My</span>{" "}
            <span className="text-secondary">Meow</span>
          </div>
          <div className="mt-5 mb-5 text-gray-800 text-base sm:text-lg">
            <span className="text-primary font-bold">Find My Meow</span>
            <br />
            สร้างขึ้นเพื่อตามหาแมวที่หายไปกลับมาพบเจ้าของอีกครั้ง
            <br />
            และตามหาครอบครัวอบอุ่นแก่แมวจรจัด
          </div>
          <div className="mt-4 font-semibold">
            <DefaultButton
              title="ตามหาแมวหาย"
              color="primary"
              onClick={handleClick}
            />
          </div>
        </div>

        {/* Right Section: Cat Image */}
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
          <img
            src="src/assets/cat-element.png"
            alt="cat-home"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* 🗺️ Map Section Title - add spacing above */}
      <div className="mt-10 text-center text-xl font-semibold text-gray-700 mb-4">
        🗺️ สำรวจตำแหน่งแมวในพื้นที่ของคุณ
        <br />
        แมวหาย / แมวหาเจ้าของ / แมวหาบ้าน
      </div>


      <div className="mt-12 w-full max-w-6xl mx-auto h-[400px]">
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
          {posts.map((post) => {
            let borderColor = "border-gray-400";
            if (post.post_type === "lost") borderColor = "border-red-500";
            else if (post.post_type === "found") borderColor = "border-blue-500";
            else if (post.post_type === "adoption") borderColor = "border-green-500";

            return (
              <OverlayView
                key={post.post_id}
                position={{
                  lat: Number(post.location.latitude),
                  lng: Number(post.location.longitude),
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  onClick={() => navigate(`/cat-detail/${post.post_id}`)}
                  className={`w-12 h-12 rounded-full ${borderColor} border-4 overflow-hidden cursor-pointer shadow-md hover:scale-110 transition-transform duration-200`}
                  title={`${post.cat_name || "ไม่ระบุ"} (${post.post_type})`}
                >
                  <img
                    src={post.cat_image?.image_path}
                    alt={post.cat_name || "cat"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </OverlayView>
            );
          })}
        </GoogleMap>


      </div>
    </div>

  );
};

export default HomePage;

