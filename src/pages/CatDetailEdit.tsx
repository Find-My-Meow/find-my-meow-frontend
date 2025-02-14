import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { locationData } from "../assets/location";
import axios from "axios";

interface Post {
    post_id: string;
    cat_name?: string;
    gender: string;
    color: string;
    breed: string;
    cat_marking: string;
    location: {
        province: string;
        district: string;
        sub_district: string;
    };
    lost_date?: string;
    other_information?: string;
    cat_image: {
        image_id: string;
        image_path: string;
    };
    post_type: string
    email_notification: boolean
}

const CatDetailEdit = () => {
    const { post_id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState<Post | null>(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [sub_district, setSub_District] = useState('');
    const [gender, setGender] = useState('');
    const [emailPreference, setEmailPreference] = useState<boolean>(false);
    const [color, setColor] = useState('');
    const [breed, setBreed] = useState('');
    const [other_information, setOther_information] = useState('');
    const [catMarking, setCatMarking] = useState('');
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

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${post_id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch post details");
                }
                const data = await response.json();
                setPost(data);
                setFormData(data);  // Set form data directly
                setImage(data.image || null);  // Set image if available
                setProvince(data.location.province || "");
                setDistrict(data.location.district || "");
                setSub_District(data.location.sub_district || "");
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

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/upload_image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            console.error("Failed to upload image");
            return null; // Return null if upload fails
        }

        const data = await response.json();
        console.log("Image upload response:", data);

        // If image uploaded successfully, return the filename
        if (data && data.filename) {
            return data.filename; // Only return filename
        } else {
            console.error("No image filename found in response");
            return null; // Return null if filename is missing
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userIdFromStorage = localStorage.getItem("user_id");
        console.log("user_id from localStorage:", userIdFromStorage);

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
        formData.append("location", JSON.stringify({ province, district, sub_district }));
        formData.append("lost_date", selectedDate || new Date().toISOString());
        formData.append("other_information", other_information);
        formData.append("email_notification", emailPreference ? "true" : "false");
        formData.append("post_type", postType);

        if (image) {
            try {
                // Upload image, and get the filename from the response
                const imageFilename = await uploadImage(image);
                console.log("Received image filename:", imageFilename);

                if (imageFilename) {
                    formData.append("cat_image", imageFilename);  // Store filename in the post
                } else {
                    console.error("Image upload failed, no image filename returned");
                }
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${post_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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
        setDistrict(''); // Reset district and sub-district
        setSub_District('');
    };

    // Handle district change
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDistrict = e.target.value;
        setDistrict(selectedDistrict);
        setSub_District(''); // Reset sub-district
    };

    const handlePostTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, id } = e.target;
        if (id === 'lost') {
            setPostType(checked ? 'lost' : ''); // Set postType to "lost" if checked
            if (checked && !selectedDate) { // Only set current date if not already set
                const currentDate = new Date().toISOString().split("T")[0];
                setSelectedDate(currentDate);
            }

        } else {
            setPostType(checked ? id : ''); // Handle other post types
        }
    };


    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };
    console.log(formData?.email_notification)

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
                        {/* Show the existing image if available */}
                        {formData && formData.cat_image && formData.cat_image.image_path ? (
                            <>
                                <label htmlFor="fileUpload" className="w-full h-full flex items-center justify-center">
                                    {/* Show current image */}
                                    <img
                                        src={`http://127.0.0.1:8000/api/v1/posts/image/${formData.cat_image.image_path}`}
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
                                <div className="mt-auto p-2 text-black">{formData.cat_image.image_path}</div>
                            </>
                        ) : (
                            <>
                                {/* If no image, show drag-and-drop option */}
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
                            <label htmlFor="postType" className="text-[#FF914D] block text-lg font-medium mb-2">
                                เลือกประเภทโพสต์
                            </label>
                            <div className="flex space-x-6">
                                <div>
                                    <input
                                        id="lost"
                                        type="checkbox"
                                        value=""
                                        onChange={handlePostTypeChange}
                                        className="mr-2"
                                        checked={formData.post_type === 'lost'}
                                    />
                                    <label htmlFor="lost">ตามหาแมวหาย</label>
                                </div>
                                <div>
                                    <input
                                        id="found"
                                        type="checkbox"
                                        value=""
                                        onChange={handlePostTypeChange}
                                        className="mr-2"
                                        checked={formData.post_type === 'found'}
                                    />
                                    <label htmlFor="found">ตามหาเจ้าของแมว</label>
                                </div>
                                <div>
                                    <input
                                        id="adoption"
                                        type="checkbox"
                                        value=""
                                        onChange={handlePostTypeChange}
                                        className="mr-2"
                                        checked={formData.post_type === 'adoption'}

                                    />
                                    <label htmlFor="ion">ตามหาบ้านให้แมว</label>
                                </div>
                            </div>
                        </div>

                        {/* Content Textarea */}
                        {formData.post_type === 'lost' && (
                            <div className="mb-6">
                                <label htmlFor="title" className="text-[#FF914D] block text-lg font-medium mb-2">
                                    ชื่อแมว
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name || formData?.cat_name || ''}
                                    onChange={(e) => setName(e.target.value)}
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
                                        value="male"
                                        onChange={(e) => setGender(e.target.checked ? 'male' : '')}
                                        className="mr-2"
                                        checked={formData.gender === 'male'}


                                    />
                                    <label htmlFor="male">เพศผู้</label>
                                </div>
                                <div>
                                    <input
                                        id="female"
                                        type="checkbox"
                                        value="female"
                                        onChange={(e) => setGender(e.target.checked ? 'female' : '')}
                                        className="mr-2"
                                        checked={formData.gender === 'female'}

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
                                    value={color || formData.color || ''}
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
                                    value={breed || formData.breed || ''}
                                    onChange={(e) => setBreed(e.target.value)}
                                    placeholder="สายพันธุ์..."
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
                                value={catMarking || formData.cat_marking || ''}
                                onChange={(e) => setCatMarking(e.target.value)}
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
                                <label htmlFor="sub_district" className="text-[#FF914D] block text-lg font-medium mb-2">
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
                        {formData.post_type === 'lost' && (
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
                                value={other_information || formData.other_information || ''}
                                onChange={(e) => setOther_information(e.target.value)}
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
                                    onChange={(e) => setEmailPreference(e.target.checked)}
                                    className="mr-2"
                                    checked={formData.email_notification === true}

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


export default CatDetailEdit;
