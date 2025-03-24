import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";

const NewPost: React.FC = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [gender, setGender] = useState("");
  const [emailPreference, setEmailPreference] = useState<boolean>(false);
  const [color, setColor] = useState("");
  const [breed, setBreed] = useState("");
  const [other_information, setOther_information] = useState("");
  const [catMarking, setCatMarking] = useState("");
  const [postType, setPostType] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // New state for selected date
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);

  const navigate = useNavigate();

  const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userIdFromStorage = localStorage.getItem("user_id");
    const userEmail = JSON.parse(localStorage.getItem("user") || "{}").email;

    if (!userIdFromStorage) {
      console.error("No user_id in localStorage");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", String(userIdFromStorage));
    formData.append("cat_name", name);
    formData.append("gender", gender);
    formData.append("color", color);
    formData.append("breed", breed);
    formData.append("cat_marking", catMarking);
    formData.append("user_email", userEmail);
    const formattedDate =
      selectedDate || new Date().toISOString().split("T")[0];
    formData.append("lost_date", formattedDate);
    formData.append("other_information", other_information);
    formData.append("email_notification", emailPreference ? "true" : "false");
    formData.append("post_type", postType);
    formData.append("status", "active");

    if (location) {
      formData.append(
        "location",
        JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
        })
      );
    } else {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกตำแหน่งบนแผนที่",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (image) {
      formData.append("cat_image", image);
    } else {
      Swal.fire({
        icon: "warning",
        title: "กรุณาอัปโหลดรูปภาพ",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    Swal.fire({
      title: "กำลังสร้างโพสต์...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      Swal.fire({
        icon: "success",
        title: "สร้างโพสต์สำเร็จ!",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        if (postType === "lost") {
          navigate("/lost-cat");
        } else if (postType === "found") {
          navigate("/found-cat");
        } else if (postType === "adoption") {
          navigate("/adopt-cat");
        } else {
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Error creating post:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถสร้างโพสต์ได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  // Handle Image Upload
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; // Date will be in the format YYYY-MM-DD
    setSelectedDate(date); // Set it directly
  };

  useEffect(() => {
    if (mapLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation); // Set marker & center
        },
        (error) => {
          console.error("Geolocation error:", error);
          // fallback to default
          setLocation(defaultCenter);
        }
      );
    }
  }, [mapLoaded]);

  return (
    <div className="h-full mb-20">
      {/* Title outside the box, centered */}
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-3xl font-bold">สร้างโพสต์ใหม่</h1>
      </div>

      <div className="max-w-6xl mx-auto bg-[#FFE9DB] shadow-md rounded-lg flex flex-col md:flex-row">
        {/* Left side: Upload photo section */}
        <div className="flex justify-center items-center w-full md:w-1/2 p-6">
          <div
            className="border-2 border-dashed border-gray-300 flex flex-col justify-center items-center rounded-lg bg-white"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!image ? (
              <div className="h-[30rem] w-[30rem] justify-items-center content-center">
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
                <div className="flex flex-col items-center">
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
              </div>
            ) : (
              <>
                <label
                  htmlFor="fileUpload"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <div className="mt-auto p-2 text-black">{image.name}</div>
              </>
            )}
          </div>
        </div>

        {/* Right side: Form section */}
        <div className="w-full md:w-2/3 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">

              <label
                htmlFor="postType"
                className="text-[#FF914D] block text-lg font-medium mb-2"
              >
                เลือกประเภทโพสต์
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex space-x-6">
                <div>
                  <input
                    id="lost"
                    type="checkbox"
                    value="lost"
                    checked={postType === "lost"}
                    onChange={() => {
                      const newValue = postType === "lost" ? "" : "lost";
                      setPostType(newValue);
                      if (newValue === "lost" && !selectedDate) {
                        const today = new Date().toISOString().split("T")[0];
                        setSelectedDate(today);
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="lost">ตามหาแมวหาย</label>
                </div>
                <div>
                  <input
                    id="found"
                    type="checkbox"
                    value="found"
                    checked={postType === "found"}
                    onChange={() =>
                      setPostType(postType === "found" ? "" : "found")
                    }
                    className="mr-2"
                  />
                  <label htmlFor="found">ตามหาเจ้าของแมว</label>
                </div>
                <div>
                  <input
                    id="adoption"
                    type="checkbox"
                    value="adoption"
                    checked={postType === "adoption"}
                    onChange={() =>
                      setPostType(postType === "adoption" ? "" : "adoption")
                    }
                    className="mr-2"
                  />
                  <label htmlFor="adoption">ตามหาบ้านให้แมว</label>
                </div>
              </div>
            </div>

            {/* Content Textarea */}
            {postType === "lost" && (
              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="text-[#FF914D] block text-lg font-medium mb-2"
                >
                  ชื่อแมว
                  <span className="text-red-500 ml-1">*</span>

                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อแมว..."
                  className="w-fit px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />

              </div>
            )}

            {/* Gender Section */}
            <div className="mb-4">
              <label
                htmlFor="gender"
                className="text-[#FF914D] block text-lg font-medium mb-2"
              >
                เพศ
                <span className="text-red-500 ml-1">*</span>

              </label>
              <div className="flex space-x-6">
                <div>
                  <input
                    id="male"
                    type="checkbox"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender(gender === "male" ? "" : "male")}
                    className="mr-2"
                  />
                  <label htmlFor="male">เพศผู้</label>
                </div>
                <div>
                  <input
                    id="female"
                    type="checkbox"
                    value="female"
                    checked={gender === "female"}
                    onChange={() =>
                      setGender(gender === "female" ? "" : "female")
                    }
                    className="mr-2"
                  />
                  <label htmlFor="female">เพศเมีย</label>
                </div>
              </div>
            </div>

            {/* Color and Breed Section (in the same line) */}
            <div className="mb-6 flex space-x-6">
              {/* Color Input */}
              <div className="w-1/2">
                <label
                  htmlFor="color"
                  className="text-[#FF914D] block text-lg font-medium mb-2"
                >
                  สี
                  <span className="text-red-500 ml-1">*</span>

                </label>
                <input
                  id="color"
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="สีแมว..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              {/* Breed Input */}
              <div className="w-1/2">
                <label
                  htmlFor="breed"
                  className="text-[#FF914D] block text-lg font-medium mb-2"
                >
                  สายพันธุ์
                  <span className="text-red-500 ml-1">*</span>

                </label>
                <input
                  id="breed"
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="สายพันธุ์..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            {/* Cat Info Input */}
            <div className="mb-6">
              <label htmlFor="catInfo" className="block text-lg font-medium mb-2 text-[#FF914D]">
                <div className="flex items-center space-x-2">
                  <span>จุดสังเกต</span>
                  <div className="relative group">
                    <div className="w-5 h-5 bg-gray-300 text-white text-sm rounded-full flex items-center justify-center cursor-pointer">
                      ?
                    </div>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-72 text-sm bg-black text-white p-2 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 text-center">
                      ระบุลักษณะเฉพาะของแมว เช่น ลาย จุด หรือตำหนิบนตัวแมว<br />
                      ช่วยให้ผู้พบเห็นจดจำได้ง่ายขึ้น
                    </div>
                  </div>
                </div>
              </label>

              <textarea
                id="catInfo"
                value={catMarking}
                onChange={(e) => setCatMarking(e.target.value)}
                placeholder="ข้อมูลแมว..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* location */}
            <div className="mb-6">
              <label className="text-[#FF914D] block text-lg font-medium mb-2">
                ตำแหน่ง
                <span className="text-red-500 ml-1">*</span>

              </label>
              <GoogleMap
                onLoad={() => setMapLoaded(true)}
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={location || defaultCenter}
                zoom={15}
                onClick={(e) =>
                  setLocation({
                    lat: e.latLng?.lat() ?? 0,
                    lng: e.latLng?.lng() ?? 0,
                  })
                }
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  streetViewControl: false,
                }}
              >
                {location && <Marker position={location} />}
              </GoogleMap>
            </div>

            {/* Conditionally render the selected date if postType is 'lostcat' */}
            {postType === "lost" && (
              <div className="mb-4">
                <label className="text-[#FF914D] block text-lg font-medium mb-2">
                  วันที่หาย
                  <span className="text-red-500 ml-1">*</span>

                </label>
                <input
                  type="date"
                  value={selectedDate || ""}
                  onChange={handleDateChange}
                  max={new Date().toISOString().split("T")[0]} // ← Limit to today
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            )}

            {/* extra content Textarea */}
            <div className="mb-6">
              <label htmlFor="extraDetails" className="block text-lg font-medium mb-2 text-[#FF914D]">
                <div className="flex items-center space-x-2">
                  <span>รายละเอียดเพิ่มเติม</span>
                  <div className="relative group">
                    <div className="w-5 h-5 bg-gray-300 text-white text-sm rounded-full flex items-center justify-center cursor-pointer">
                      ?
                    </div>
                    <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-72 text-sm bg-black text-white p-3 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                      ระบุรายละเอียดเพิ่มเติม เช่น สถานที่หาย/พบ ช่วงเวลาที่หาย หรือพฤติกรรมพิเศษของแมว
                    </div>
                  </div>
                </div>
              </label>

              <textarea
                id="extraDetails"
                value={other_information}
                onChange={(e) => setOther_information(e.target.value)}
                placeholder="รายละเอียดเพิ่มเติม..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Email Section */}
            <div className="mb-4 flex items-center space-x-4">
              <label htmlFor="email" className="text-[#FF914D] text-lg font-medium flex items-center">
                รับแจ้งเตือนผ่าน Email
                <div className="relative group ml-2">
                  <div className="w-5 h-5 bg-gray-300 text-white text-sm rounded-full flex items-center justify-center cursor-pointer">
                    ?
                  </div>
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-72 text-sm bg-black text-white p-3 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                    หากเลือก "รับ" ระบบจะส่งอีเมลแจ้งเตือนเมื่อมีโพสต์แมวที่มีลักษณะคล้ายกันปรากฏขึ้น
                    <br />
                    <span className="block mt-2 text-gray-300 text-xs">
                      * อีเมลอาจเข้าไปอยู่ในกล่อง Spam หรือ Junk Mail
                    </span>
                  </div>
                </div>
              </label>

              <div className="flex items-center">
                <input
                  id="email"
                  type="checkbox"
                  value="Email"
                  onChange={(e) => setEmailPreference(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="email">รับ</label>
              </div>
            </div>


            {/* Submit Button */}
            <div className="mb-6 flex items-end space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-[#FF914D] text-white font-bold rounded-lg hover:bg-[#FFE9DB] transition "
              >
                ตกลง
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
