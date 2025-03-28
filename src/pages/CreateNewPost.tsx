import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import heic2any from "heic2any";
import { useNavigate } from "react-router-dom";
import { MutatingDots } from "react-loader-spinner";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import LocationMap from "../components/LocationMap";

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
  const [isLoadingImage, setIsLoadingImage] = useState(false);

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

    if (!image) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาอัปโหลดรูปภาพ",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // Check image quality before adding to formData
    const qualityCheck = new FormData();
    qualityCheck.append("file", image);

    try {
      const qualityRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/image/check-quality`,
        qualityCheck
      );

      const issues = qualityRes.data.issues || [];

      // Image too small
      if (issues.includes("resolution")) {
        Swal.fire({
          icon: "error",
          title: "รูปภาพมีขนาดเล็กเกินไป",
          text: "กรุณาเลือกรูปที่มีความละเอียดสูงขึ้น",
        });
        return;
      }

      // Image blur: warning
      if (issues.includes("blurry")) {
        const result = await Swal.fire({
          icon: "warning",
          title: "รูปภาพอาจจะเบลอ",
          text: "คุณต้องการใช้รูปภาพนี้ต่อไปหรือไม่? การใช้รูปภาพเบลออาจทำให้การค้นหาไม่แม่นยำ",
          showCancelButton: true,
          confirmButtonText: "ใช้รูปนี้ต่อไป",
          cancelButtonText: "เปลี่ยนรูป",
        });

        if (!result.isConfirmed) {
          return;
        }
      }
      // Passed all checks, append to formData
      formData.append("cat_image", image);
    } catch (error) {
      console.error("Image quality check failed:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถตรวจสอบคุณภาพของรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
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
          navigate(`/cat-detail/${response.data.post_id}`);
      });
    } catch (error) {
      console.error("Error creating post:", error);
      // Extract server error response
      const errorMessage =
        (error as any)?.response?.data?.detail ||
        "ไม่สามารถสร้างโพสต์ได้ กรุณาลองใหม่อีกครั้ง";

      // Handle specific case for "no cat detected"
      if (
        typeof errorMessage === "string" &&
        errorMessage.includes("No cat detected")
      ) {
        Swal.fire({
          icon: "warning",
          title: "ไม่พบแมวในรูปภาพ",
          text: "กรุณาเลือกรูปภาพที่เห็นแมวอย่างชัดเจนใหม่อีกครั้ง",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      // Fallback for other errors
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: errorMessage,
      });
    }
  };

  // Handle Image Upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoadingImage(true); // start loading

    if (
      file.type === "image/heic" ||
      file.name.toLowerCase().endsWith(".heic")
    ) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.9,
        });

        const jpegFile = new File(
          [convertedBlob as Blob],
          file.name.replace(/\.heic$/i, ".jpg"),
          { type: "image/jpeg" }
        );

        setImage(jpegFile);
      } catch (error) {
        console.error("Failed to convert HEIC:", error);
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถแสดงรูปภาพไฟล์ HEIC ได้",
          text: "กรุณาเลือกรูปภาพที่เป็น JPG หรือ PNG",
        });
      }
    } else {
      setImage(file);
    }
    setIsLoadingImage(false); // end loading
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

      <div className="max-w-6xl mx-auto bg-[#FFE9DB] shadow-md rounded-lg flex flex-col md:flex-row pt-4">
        {/* Left side: Upload photo section */}
        <div className="flex flex-col justify-start items-center w-full md:w-1/2 p-6 pr-2 space-y-2">
          <div className="w-full">
            <label className="text-[#FF914D] block text-lg font-medium text-center">
              อัพโหลดรูปภาพแมว
            </label>
          </div>
          <div
            className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-300 shadow-sm bg-white flex items-center justify-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isLoadingImage ? (
              <div className="h-[30rem] w-[30rem] flex flex-col items-center justify-center">
                <MutatingDots
                  visible={true}
                  height="100"
                  width="100"
                  color="#FF914D"
                  secondaryColor="#FF914D"
                  radius="12.5"
                  ariaLabel="mutating-dots-loading"
                />

                <p className="text-[#FF914D] text-lg">กำลังโหลดรูปภาพ...</p>
              </div>
            ) : !image ? (
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <MdOutlineFileUpload className="text-5xl" />
                <p className="text-black font-med">ลากและวางรูปภาพที่นี่</p>
                <p className="text-black">หรือ</p>
                <div className="flex flex-col items-center">
                  <label
                    htmlFor="fileUpload"
                    className="px-4 py-2 bg-[#FFE9DB] text-black rounded-lg cursor-pointer hover:bg-[#FFA864] transition"
                  >
                    เลือกรูปภาพ
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
              <div className="w-full max-w-md h-[25rem] relative p-2">
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute -top-3 right-1 p-1 bg-white rounded-full text-red-500 text-3xl hover:text-red-600 transition z-10"
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

                <div className="mt-auto p-2 text-black text-center text-sm">
                  {image.name}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Form section */}
        <div className="w-full md:w-2/3 p-6 m-5 rounded-lg bg-white ">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="postType"
                className="text-[#FF914D] block text-lg font-medium mb-2"
              >
                เลือกประเภทโพสต์
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex space-x-8 ml-2">
                <div className="flex items-center space-x-2">
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
                    className="scale-150"
                  />
                  <label htmlFor="lost">ตามหาแมวหาย</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="found"
                    type="checkbox"
                    value="found"
                    checked={postType === "found"}
                    onChange={() =>
                      setPostType(postType === "found" ? "" : "found")
                    }
                    className="scale-150"
                  />
                  <label htmlFor="found">ตามหาเจ้าของแมว</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="adoption"
                    type="checkbox"
                    value="adoption"
                    checked={postType === "adoption"}
                    onChange={() =>
                      setPostType(postType === "adoption" ? "" : "adoption")
                    }
                    className="scale-150"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
              <div className="flex space-x-8 ml-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="male"
                    type="checkbox"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender(gender === "male" ? "" : "male")}
                    className="scale-150"
                  />
                  <label htmlFor="male">เพศผู้</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="female"
                    type="checkbox"
                    value="female"
                    checked={gender === "female"}
                    onChange={() =>
                      setGender(gender === "female" ? "" : "female")
                    }
                    className="scale-150"
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
              <label
                htmlFor="catInfo"
                className="block text-lg font-medium mb-2 text-[#FF914D]"
              >
                <div className="flex items-center space-x-2">
                  <span>จุดสังเกต</span>
                  <div className="relative group">
                    <div className="w-5 h-5 bg-gray-300 text-white text-sm rounded-full flex items-center justify-center cursor-pointer">
                      ?
                    </div>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-72 text-sm bg-black text-white p-2 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 text-center">
                      ระบุลักษณะเฉพาะของแมว เช่น ลาย จุด หรือตำหนิบนตัวแมว
                      <br />
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
              <LocationMap
                location={location}
                setLocation={setLocation}
                radius={0}
              />
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
              <label
                htmlFor="extraDetails"
                className="block text-lg font-medium mb-2 text-[#FF914D]"
              >
                <div className="flex items-center space-x-2">
                  <span>รายละเอียดเพิ่มเติม</span>
                  <div className="relative group">
                    <div className="w-5 h-5 bg-gray-300 text-white text-sm rounded-full flex items-center justify-center cursor-pointer">
                      ?
                    </div>
                    <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-72 text-sm bg-black text-white p-3 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                      ระบุรายละเอียดเพิ่มเติม เช่น สถานที่หาย/พบ ช่วงเวลาที่หาย
                      พฤติกรรมพิเศษของแมว ข้อมูลการติดต่อ
                    </div>
                  </div>
                </div>
              </label>

              <textarea
                id="extraDetails"
                value={other_information}
                onChange={(e) => setOther_information(e.target.value)}
                placeholder="รายละเอียดอื่นๆ เพิ่มเติม..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Email Section */}
            <div className="mb-4 flex items-center space-x-4">
              <label
                htmlFor="email"
                className="text-[#FF914D] text-lg font-medium flex items-center"
              >
                รับแจ้งเตือนผ่าน Email
                <div className="relative group ml-2">
                  <div className="w-5 h-5 bg-gray-300 text-white text-sm rounded-full flex items-center justify-center cursor-pointer">
                    ?
                  </div>
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-72 text-sm bg-black text-white p-3 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                    หากเลือก "รับ"
                    ระบบจะส่งอีเมลแจ้งเตือนเมื่อมีโพสต์แมวที่มีลักษณะคล้ายกันปรากฏขึ้น
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
            <div className="mb-6 flex space-x-4 justify-center">
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
