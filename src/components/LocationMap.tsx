import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";

interface Props {
  location: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
  radius: number;
  readOnly?: boolean;
}

const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok

const LocationMap = ({ location, setLocation, radius, readOnly }: Props) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markerReady, setMarkerReady] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [searchText, setSearchText] = useState("");

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

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

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const newLoc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(newLoc);
        setLocation(newLoc);
        mapRef.current?.panTo(newLoc);
        updateCircle(newLoc);
        setSearchText(place.formatted_address || place.name || "");
        setMarkerReady(true);
      }
    }
  };

  const goToMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLoc);
          setLocation(userLoc);
          mapRef.current?.panTo(userLoc);
          updateCircle(userLoc);
          setMarkerReady(true);
        },
        (error) => {
          console.error("Geolocation error:", error);
          Swal.fire({
            icon: "error",
            title: "ไม่สามารถดึงตำแหน่งได้",
            text: "โปรดตรวจสอบว่าอนุญาตให้เข้าถึงตำแหน่งแล้ว",
          });
        }
      );
    }
  };

  // Initialize from provided location (e.g. editing/viewing a post)
  useEffect(() => {
    if (location && mapRef.current && !markerReady) {
      setMapCenter(location);
      mapRef.current.panTo(location);
      updateCircle(location);
      setMarkerReady(true);
    }
  }, [location, mapLoaded, markerReady]);

  // Fallback to current location only if no initial location is provided
  useEffect(() => {
    if (!location && mapLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(userLoc);
          mapRef.current?.panTo(userLoc);
        },
        () => {
          mapRef.current?.panTo(defaultCenter);
        }
      );
    }
  }, [mapLoaded, location]);

  useEffect(() => {
    if (location) updateCircle(location);
  }, [radius]);

  useEffect(() => {
    if (location) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          setSearchText(results[0].formatted_address || "");
        } else {
          console.warn("Geocoder failed:", status);
          setSearchText("");
        }
      });
    }
  }, [location]);

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-300 shadow-sm relative">
      <div className="absolute top-3 left-3 right-3 z-10">
        <Autocomplete
          onLoad={(autocompleteInstance) => {
            autocompleteInstance.setComponentRestrictions({ country: "th" });
            setAutocomplete(autocompleteInstance);
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="ค้นหาตำแหน่ง..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm text-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            readOnly={readOnly}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
        </Autocomplete>

        {!readOnly && searchText && (
          <button
            type="button"
            onClick={() => setSearchText("")}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
            title="ล้างข้อความ"
          >
            <IoIosCloseCircleOutline />
          </button>
        )}
      </div>

      <GoogleMap
        onLoad={handleMapLoad}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={15}
        onClick={(e) => {
          if (readOnly) return;
          const clicked = {
            lat: e.latLng?.lat() ?? 0,
            lng: e.latLng?.lng() ?? 0,
          };
          setLocation(clicked);
          updateCircle(clicked);
          setMarkerReady(true);
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
        }}
      >
        {markerReady && location && (
          <Marker
            position={location}
            icon={
              readOnly
                ? {
                    url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png",
                    scaledSize: new window.google.maps.Size(30, 40),
                  }
                : undefined
            }
          />
        )}
      </GoogleMap>

      <div className="absolute top-60 right-3 z-10">
        <button
          type="button"
          title="ไปยังตำแหน่งปัจจุบันของคุณ"
          onClick={goToMyLocation}
          className="bg-white text-[#2146ea] px-3 py-3 rounded-lg shadow hover:bg-[#2146ea] hover:text-white transition font-semibold text-sm"
        >
          <FaLocationArrow />
        </button>
      </div>
    </div>
  );
};

export default LocationMap;