import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Swal from "sweetalert2";
import heic2any from "heic2any";
import { MutatingDots } from "react-loader-spinner";

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
interface Cat_image {
  image_id: string;
  stored_filename: string;
  image_path: string;
}

const CatDetailEdit = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Post | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<Cat_image | null>(null);
  const [gender, setGender] = useState("");
  const [emailPreference, setEmailPreference] = useState<boolean>(false);
  const [color, setColor] = useState("");
  const [breed, setBreed] = useState("");
  const [other_information, setOther_information] = useState("");
  const [catMarking, setCatMarking] = useState("");
  const [postType, setPostType] = useState("");
  const [status, setStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // New state for selected date
  const [userMatch, setUserMatch] = useState<boolean>(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const navigate = useNavigate();

  const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${post_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        const data = await response.json();
        setPost(data);
        setFormData(data); // Set form data directly
        setImage(data.image || null); // Set image if available
        setExistingImage(
          data.cat_image && typeof data.cat_image === "object"
            ? data.cat_image
            : null
        );
        setLocation({
          lat: Number(data.location.latitude),
          lng: Number(data.location.longitude),
        });
        setPostType(data.post_type); // ← so the radio shows correctly initially
        setGender(data.gender);
        setEmailPreference(data.email_notification);
        const storedUserId = localStorage.getItem("user_id");
        if (data.user_id === storedUserId) {
          setUserMatch(true);
        } else {
          setUserMatch(false);
        }

        if (data.post_type === "lost" && data.lost_date) {
          setSelectedDate(data.lost_date.split("T")[0]); // Format date to YYYY-MM-DD
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    if (post_id) {
      fetchPostDetail();
    }
  }, [post_id]);
  if (!formData) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  if (!userMatch) {
    return (
      <div className="text-center mt-10 text-red-500">
        คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedUserId = localStorage.getItem("user_id");
    const parsedUser = JSON.parse(localStorage.getItem("user") || "{}");

    // Ensure `user_id` is correctly set
    const userId =
      storedUserId && storedUserId !== "null"
        ? storedUserId
        : formData?.user_id;
    if (!userId) {
      console.error("No valid user_id found");
      alert("Error: Missing user_id. Please log in again.");
      return;
    }

    // Ensure `user_email` is correctly set
    const userEmail = parsedUser.email || formData?.user_email;
    if (!userEmail) {
      console.error("No valid user_email found");
      alert("Error: Missing user email.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", userId);
    formDataToSend.append("user_email", userEmail);
    formDataToSend.append("cat_name", name || formData?.cat_name || "");
    formDataToSend.append("gender", gender || formData?.gender || "");
    formDataToSend.append("color", color || formData?.color || "");
    formDataToSend.append("breed", breed || formData?.breed || "");
    formDataToSend.append(
      "cat_marking",
      catMarking || formData?.cat_marking || ""
    );
    if (location) {
      formDataToSend.append(
        "location",
        JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
        })
      );
    }
    formDataToSend.append(
      "lost_date",
      selectedDate || formData?.lost_date || ""
    );
    formDataToSend.append(
      "other_information",
      other_information || formData?.other_information || ""
    );
    formDataToSend.append(
      "email_notification",
      emailPreference?.toString() ||
        formData?.email_notification?.toString() ||
        "false"
    );
    formDataToSend.append("post_type", postType || formData?.post_type || "");
    formDataToSend.append("status", status || "active");

    if (image) {
      // Check image quality before uploading
      const qualityForm = new FormData();
      qualityForm.append("file", image);

      try {
        const qualityResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/image/check-quality`,
          qualityForm
        );

        const issues = qualityResponse.data.issues || [];

        // Image too small
        if (issues.includes("resolution")) {
          await Swal.fire({
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
        // New image was uploaded
        formDataToSend.append("cat_image", image);
      } catch (error) {
        console.error("Image quality check failed:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถตรวจสอบคุณภาพของรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
        });
        return;
      }
    } else if (formData?.cat_image?.image_id) {
      // No new image, but an existing one is present
      formDataToSend.append("image_id", formData.cat_image.image_id);
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
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${post_id}`;
      console.log("Sending request to:", url);

      const response = await axios.put(url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      await Swal.fire({
        icon: "success",
        title: "อัปเดตโพสต์เรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate(`/cat-detail/${post?.post_id}`);
      });
    } catch (error: unknown) {
      // Handle specific case for "no cat detected"
      const errorMessage =
        error?.response?.data?.detail ||
        "ไม่สามารถอัปเดตโพสต์ได้ กรุณาลองใหม่อีกครั้ง";
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

      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
      } else {
        console.error("Unknown Error:", error);
      }

      await Swal.fire({
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
      setExistingImage(null);
    }
    setIsLoadingImage(false); // end loading
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
      setExistingImage(null);
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
    setSelectedDate(e.target.value);
  };

  return (
    <div className="h-full">
      {/* Title outside the box, centered */}
      <div className="flex justify-center items-center pt-20 mb-8">
        <h1 className="text-3xl font-bold">แก้ไขโพสต์</h1>
        <h1>{formData?.email_notification}</h1>
      </div>

      <div className="max-w-6xl mx-auto bg-[#FFE9DB] shadow-md rounded-lg flex">
        {/* Left side: Upload photo section */}
        <div className="flex justify-start items-center w-1/2 p-6">
          <div
            className="w-full h-64 border-2 border-dashed border-gray-300 flex flex-col justify-center items-center rounded-lg bg-white"
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
                  wrapperStyle={{}}
                  wrapperClass=""
                />

                <p className="text-[#FF914D] text-lg">กำลังโหลดรูปภาพ...</p>
              </div>
            ) : image ? (
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
            ) : existingImage ? (
              <>
                <label
                  htmlFor="fileUpload"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={`${existingImage.image_path}`}
                    alt="Existing"
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
                <div className="mt-auto p-2 text-black">
                  {existingImage.image_path}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Right side: Form section */}
        <div className="w-2/3 p-6">
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
                {["lost", "found", "adoption"].map((type) => (
                  <div key={type}>
                    <input
                      id={type}
                      type="checkbox"
                      name="postType"
                      value={type}
                      checked={postType === type}
                      onChange={() =>
                        setPostType(postType === type ? "" : type)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={type}>
                      {
                        {
                          lost: "ตามหาแมวหาย",
                          found: "ตามหาเจ้าของแมว",
                          adoption: "ตามหาบ้านให้แมว",
                        }[type]
                      }
                    </label>
                  </div>
                ))}
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
                  value={name || formData?.cat_name || ""}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อแมว..."
                  className="w-fit px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            )}

            {/* Gender Section */}
            <div className="mb-4">
              <label className="text-[#FF914D] block text-lg font-medium mb-2">
                เพศ
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex space-x-6">
                <div>
                  <input
                    id="male"
                    type="checkbox"
                    value="male"
                    onChange={() => setGender(gender === "male" ? "" : "male")}
                    className="mr-2"
                    checked={gender === "male"}
                  />
                  <label htmlFor="male">เพศผู้</label>
                </div>
                <div>
                  <input
                    id="female"
                    type="checkbox"
                    value="female"
                    onChange={() =>
                      setGender(gender === "female" ? "" : "female")
                    }
                    className="mr-2"
                    checked={gender === "female"}
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
                  value={color || formData.color || ""}
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
                  value={breed || formData.breed || ""}
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
                className="text-[#FF914D] block text-lg font-medium mb-2 text-[#FF914D]"
              >
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
                value={catMarking || formData.cat_marking || ""}
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
                center={
                  location?.lat && location?.lng ? location : defaultCenter
                }
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
              <label
                htmlFor="extraDetails"
                className="text-[#FF914D] block text-lg font-medium mb-2 text-[#FF914D]">
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
                value={other_information || formData.other_information || ""}
                onChange={(e) => setOther_information(e.target.value)}
                placeholder="รายละเอียดเพิ่มเติม..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {/* Email Section */}
            {(postType === "lost" || postType === "found") && (
            <div className="mb-4 flex items-center space-x-4">
              <label
                htmlFor="email"
                className="text-[#FF914D] text-lg font-medium flex items-center">
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
                  onChange={(e) => setEmailPreference(e.target.checked)}
                  className="mr-2"
                  checked={emailPreference === true}
                />
                <label htmlFor="email">รับ</label>
              </div>
            </div>)}

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

export default CatDetailEdit;
