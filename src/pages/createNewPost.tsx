import React, { useState } from 'react';
import axios from 'axios';
import { locationData } from '../assets/location';

const NewPost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [subDistrict, setSubDistrict] = useState('');
    const [gender, setGender] = useState('');
    const [emailPreference, setEmailPreference] = useState('');
    const [color, setColor] = useState('');
    const [breed, setBreed] = useState('');
    const [extra_details, setExtraDetails] = useState('');
    const [cat_info, setCatinfo] = useState('');
    const [postType, setPostType] = useState('');
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // New state for selected date


    const provinces = Array.from(new Set(locationData.map(item => item.province)));
    const districts = (province: string) => {
        const filteredDistricts = locationData.filter(item => item.province === province);
        const uniqueDistricts = Array.from(new Set(filteredDistricts.map(item => item.amphoe)));
        return uniqueDistricts;
    };

    const subDistricts = (district: string) => {
        return locationData.filter(item => item.amphoe === district).map(item => item.district);
    };
    // Function to handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("province", province);
        formData.append("district", district);
        formData.append("sub_district", subDistrict);
        formData.append("gender", gender);
        formData.append("email_preference", emailPreference);
        formData.append("color", color);
        formData.append("breed", breed);
        formData.append("extra_details", extra_details)
        formData.append("cat_info", cat_info)
        formData.append("post_type", postType)
        formData.append("date", selectedDate || "");



        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post("http://localhost:8000/create-post/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Response:", response.data);
            alert("Post created successfully!");

            // Reset form after successful submission
            setTitle("");
            setImage(null);
            setProvince("");
            setDistrict("");
            setSubDistrict("");
            setBreed("")
            setColor('')
            setEmailPreference("")
            setGender("")
            setExtraDetails("")
            setCatinfo("")
            setSelectedDate("")
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
        setDistrict(''); // Reset district and sub-district
        setSubDistrict('');
    };

    // Handle district change
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDistrict = e.target.value;
        setDistrict(selectedDistrict);
        setSubDistrict(''); // Reset sub-district
    };

    const handlePostTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, id } = e.target;
        if (id === 'lostcat') {
            setPostType(checked ? 'lostcat' : ''); // Set postType to "lostcat"
            if (checked) {
                const currentDate = new Date().toISOString().split("T")[0];
                setSelectedDate(currentDate);
                setSelectedDate(null);
            }
        } else {
            setPostType(checked ? id : '');
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div className="h-full">
            {/* Title outside the box, centered */}
            <div className="flex justify-center items-center pt-20 mb-8">
                <h1 className="text-3xl font-bold">สร้างโพสต์ใหม่</h1>
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
                        {!image ? (
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
                        ) : (
                            <>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Selected"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="mt-auto p-2 text-black">{image.name}</div>
                            </>
                        )}
                    </div>
                </div>


                {/* Right side: Form section */}
                <div className="w-2/3 p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="postType" className="text-[#FF914D] block text-lg font-medium mb-2">
                                เลือกประเภทโพสต์
                            </label>
                            <div className="flex space-x-6">
                                <div>
                                    <input
                                        id="lostcat"
                                        type="checkbox"
                                        value=""
                                        onChange={handlePostTypeChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="lostcat">ตามหาแมวหาย</label>
                                </div>
                                <div>
                                    <input
                                        id="foundcat"
                                        type="checkbox"
                                        value=""
                                        onChange={handlePostTypeChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="foundcat">ตามหาเจ้าของแมว</label>
                                </div>
                                <div>
                                    <input
                                        id="adoptcat"
                                        type="checkbox"
                                        value=""
                                        onChange={handlePostTypeChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="adoptcat">ตามหาบ้านให้แมว</label>
                                </div>
                            </div>
                        </div>

                        {/* Content Textarea */}
                        {postType === 'lostcat' && (
                        <div className="mb-6">
                            <label htmlFor="title" className="text-[#FF914D] block text-lg font-medium mb-2">
                                ชื่อแมว
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ชื่อแมว..."
                                className="w-fit px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>)}

                        {/* Gender Section */}
                        <div className="mb-4">
                            <label htmlFor="gender" className="text-[#FF914D] block text-lg font-medium mb-2">
                                เพศ
                            </label>
                            <div className="flex space-x-6">
                                <div>
                                    <input
                                        id="male"
                                        type="checkbox"
                                        value="Male"
                                        onChange={(e) => setGender(e.target.checked ? 'เพศผู้' : '')}
                                        className="mr-2"
                                    />
                                    <label htmlFor="male">เพศผู้</label>
                                </div>
                                <div>
                                    <input
                                        id="female"
                                        type="checkbox"
                                        value="Female"
                                        onChange={(e) => setGender(e.target.checked ? 'เพศเมีย' : '')}
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
                                <label htmlFor="color" className="text-[#FF914D] block text-lg font-medium mb-2">
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
                                <label htmlFor="breed" className="text-[#FF914D] block text-lg font-medium mb-2">
                                    สายพันธุ์
                                </label>
                                <input
                                    id="breed"
                                    type="text"
                                    value={breed}
                                    onChange={(e) => setBreed(e.target.value)}
                                    placeholder="สายพันธ์..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                        </div>
                        {/* Cat Info Input */}
                        <div className="mb-6">
                            <label htmlFor="catInfo" className="text-[#FF914D] block text-lg font-medium mb-2">
                                จุดสังเกต
                            </label>
                            <textarea
                                id="catInfo"
                                value={cat_info}
                                onChange={(e) => setCatinfo(e.target.value)}
                                placeholder="ข้อมูลแมว..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-6 flex space-x-4">
                            {/* Province Dropdown */}
                            <div className="flex-1">
                                <label htmlFor="province" className="text-[#FF914D] block text-lg font-medium mb-2">
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
                                <label htmlFor="district" className="text-[#FF914D] block text-lg font-medium mb-2">
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
                                <label htmlFor="subDistrict" className="text-[#FF914D] block text-lg font-medium mb-2">
                                    เขต/ตำบล
                                </label>
                                <select
                                    id="subDistrict"
                                    value={subDistrict}
                                    onChange={(e) => setSubDistrict(e.target.value)}
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
                        {postType === 'lostcat' && (
                            <div className="mb-4">
                                <label className="text-[#FF914D] block text-lg font-medium mb-2">วันที่หาย</label>
                                <input
                                    type="date"
                                    value={selectedDate || ''}
                                    onChange={handleDateChange}
                                    className="w-full border p-2 rounded-lg"
                                />
                            </div>
                        )}

                        {/* extra content Textarea */}
                        <div className="mb-6">
                            <label htmlFor="extraDetails" className="text-[#FF914D] block text-lg font-medium mb-2">
                                รายละเอียดเพิ่มเติม
                            </label>
                            <textarea
                                id="extraDetails"
                                value={extra_details}
                                onChange={(e) => setExtraDetails(e.target.value)}
                                placeholder="รายละเอียดเพิ่มเติม..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                required
                            />
                        </div>
                        {/* Email Section */}
                        <div className="mb-4 flex items-center space-x-4">
                            <label htmlFor="email" className="text-[#FF914D] text-lg font-medium">
                                รับแจ้งเตือนผ่าน Email
                            </label>
                            <div className="flex items-center">
                                <input
                                    id="email"
                                    type="checkbox"
                                    value="Email"
                                    onChange={(e) => setEmailPreference(e.target.checked ? 'รับ' : '')}
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
