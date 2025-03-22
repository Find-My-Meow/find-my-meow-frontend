import React, { useState } from "react";
import axios from "axios";
import { locationData } from "../assets/location";

const NewPost: React.FC = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sub_district, setSub_District] = useState("");
  const [gender, setGender] = useState("");
  const [emailPreference, setEmailPreference] = useState<boolean>(false);
  const [color, setColor] = useState("");
  const [breed, setBreed] = useState("");
  const [other_information, setOther_information] = useState("");
  const [catMarking, setCatMarking] = useState("");
  const [postType, setPostType] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // New state for selected date

  const provinces = Array.from(
    new Set(locationData.map((item) => item.province))
  );
  const districts = (province: string) => {
    const filteredDistricts = locationData.filter(
      (item) => item.province === province
    );
    const uniqueDistricts = Array.from(
      new Set(filteredDistricts.map((item) => item.amphoe))
    );
    return uniqueDistricts;
  };

  const subDistricts = (district: string) => {
    return locationData
      .filter((item) => item.amphoe === district)
      .map((item) => item.district);
  };
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Failed to upload image");
        return null;
      }

      const data = await response.json();
      console.log("Image upload response:", data);

      if (data?.image_id && data?.stored_filename && data?.image_path) {
        return {
          image_id: data.image_id,
          stored_filename: data.stored_filename,
          image_path: data.image_path,
        };
      } else {
        console.error("Invalid image response format");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };


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
    formData.append(
      "location",
      JSON.stringify({ province, district, sub_district })
    );
    formData.append("user_email", userEmail);
    const formattedDate = selectedDate || new Date().toISOString().split("T")[0];
    formData.append("lost_date", formattedDate);
    formData.append("other_information", other_information);
    formData.append("email_notification", emailPreference ? "true" : "false");
    formData.append("post_type", postType);
    formData.append("status", 'active')

    if (image) {
      try {
        const imageData = await uploadImage(image);
        console.log("Received image data:", imageData);

        if (imageData) {
          formData.append("cat_image", image); // Send the actual image file
          formData.append("image_id", imageData.image_id);
          formData.append("image_path", imageData.image_path);
        } else {
          console.error("Image upload failed, no valid image data returned");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }


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
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
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

  // Handle province change
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setDistrict(""); // Reset district and sub-district
    setSub_District("");
  };

  // Handle district change
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setSub_District(""); // Reset sub-district
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value; // Date will be in the format YYYY-MM-DD
    setSelectedDate(date); // Set it directly
  };

  return (
    <div className="h-full mb-20">
      {/* Title outside the box, centered */}
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-3xl font-bold">สร้างโพสต์ใหม่</h1>
      </div>

      <div className="max-w-6xl mx-auto bg-[#FFE9DB] shadow-md rounded-lg flex">
        {/* Left side: Upload photo section */}
        <div className="flex justify-start items-center w-1/2 p-6">
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
        <div className="w-2/3 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="postType"
                className="text-[#FF914D] block text-lg font-medium mb-2"
              >
                เลือกประเภทโพสต์
              </label>
              <div className="flex space-x-6">
                <div>
                  <input
                    id="lost"
                    type="radio"
                    name="postType"
                    value="lost"
                    checked={postType === "lost"}
                    onChange={(e) => {
                      setPostType(e.target.value);
                      if (!selectedDate) {
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
                    type="radio"
                    name="postType"
                    value="found"
                    checked={postType === "found"}
                    onChange={(e) => setPostType(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="found">ตามหาเจ้าของแมว</label>
                </div>
                <div>
                  <input
                    id="adoption"
                    type="radio"
                    name="postType"
                    value="adoption"
                    checked={postType === "adoption"}
                    onChange={(e) => setPostType(e.target.value)}
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
              </label>
              <div className="flex space-x-6">
                <div>
                  <input
                    id="male"
                    type="checkbox"
                    value="male"
                    onChange={(e) => setGender(e.target.checked ? "male" : "")}
                    className="mr-2"
                  />
                  <label htmlFor="male">เพศผู้</label>
                </div>
                <div>
                  <input
                    id="female"
                    type="checkbox"
                    value="female"
                    onChange={(e) =>
                      setGender(e.target.checked ? "female" : "")
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
                className="text-[#FF914D] block text-lg font-medium mb-2"
              >
                จุดสังเกต
              </label>
              <textarea
                id="catInfo"
                value={catMarking}
                onChange={(e) => setCatMarking(e.target.value)}
                placeholder="ข้อมูลแมว..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-6 flex space-x-4">
              {/* Province Dropdown */}
              <div className="flex-1">
                <label
                  htmlFor="province"
                  className="text-[#FF914D] block text-lg font-medium mb-2"
                >
                  จังหวัด
                </label>
                <select
                  id="province"
                  value={province}
                  onChange={handleProvinceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">เลือกจังหวัด</option>
                  {provinces.map((prov, index) => (
                    <option key={index} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Dropdown */}
              <div className="flex-1">
                <label
                  htmlFor="district"
                  className="text-[#FF914D] block text-lg font-medium mb-2"
                >
                  แขวง/อำเภอ
                </label>
                <select
                  id="district"
                  value={district}
                  onChange={handleDistrictChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">เลือกแขวง/อำเภอ</option>
                  {districts(province).map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-district Dropdown */}
              <div className="flex-1">
                <label
                  htmlFor="sub_district"
                  className="text-[#FF914D] block text-lg font-medium mb-2"
                >
                  เขต/ตำบล
                </label>
                <select
                  id="sub_district"
                  value={sub_district}
                  onChange={(e) => setSub_District(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">เลือกเขต/ตำบล</option>
                  {subDistricts(district)?.map((subDist, index) => (
                    <option key={index} value={subDist}>
                      {subDist}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Conditionally render the selected date if postType is 'lostcat' */}
            {postType === "lost" && (
              <div className="mb-4">
                <label className="text-[#FF914D] block text-lg font-medium mb-2">
                  วันที่หาย
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
                className="text-[#FF914D] block text-lg font-medium mb-2"
              >
                รายละเอียดเพิ่มเติม
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
              <label
                htmlFor="email"
                className="text-[#FF914D] text-lg font-medium"
              >
                รับแจ้งเตือนผ่าน Email
              </label>
              <div className="flex items-center">
                <input
                  id="email"
                  type="checkbox"
                  value="Email"
                  onChange={(e) =>
                    setEmailPreference(e.target.checked ? true : false)
                  }
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
