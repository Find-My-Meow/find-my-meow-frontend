import { useNavigate } from "react-router-dom";
import { locationData } from '../assets/location';

import { useState } from "react";
const SearchPage = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null);
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [subDistrict, setSubDistrict] = useState('');
    // Function to navigate to New Post page
    const handleClick = () => {
        // Navigate to the /new-post route when the button is clicked
        navigate("/result");
    };


    const provinces = Array.from(new Set(locationData.map(item => item.province)));
    const districts = (province: string) => {
        const filteredDistricts = locationData.filter(item => item.province === province);
        const uniqueDistricts = Array.from(new Set(filteredDistricts.map(item => item.amphoe)));
        return uniqueDistricts;
    };

    const subDistricts = (district: string) => {
        return locationData.filter(item => item.amphoe === district).map(item => item.district);
    };
    // Handle Image Upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);  // Update the image state with the new selected file
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImage(e.dataTransfer.files[0]);  // Update the image state if the user drops a new image
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

    return (
        <div className="h-full mb-20">
            {/* Title at the top center */}
            <div className="flex justify-center items-start mb-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">ค้นหาแมวหาย</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto bg-[#FFE9DB] shadow-md rounded-lg flex">
                {/* Left side: Upload photo section */}
                <div className="flex flex-col justify-start items-center w-1/2 p-6">
                    <label htmlFor="searchimage" className="text-[#FF914D] block text-lg font-medium mb-4">
                        อัพโหลดรูปภาพแมวของคุณ
                    </label>
                    <div
                        className="border-2 border-dashed border-gray-300 flex flex-col justify-center items-center rounded-lg bg-white"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {!image ? (
                            <div className='h-[20rem] w-[25rem] justify-items-center content-center'>
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
                            <div className='w-64 max-h-[20rem] justify-items-center content-center'>
                                <label htmlFor="fileUpload" className="w-full h-full flex items-center justify-center">
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
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Search by location section */}
                <div className="flex flex-col justify-start items-start w-1/2 p-6">
                    <label htmlFor="location" className="text-[#FF914D] block text-lg font-medium mb-4">
                        ค้นหาด้วยตำแหน่ง
                    </label>
                    {/* Province Dropdown */}
                    <div className="mb-4 w-full">
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
                    <div className="mb-4 w-full">
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
                    <div className="mb-4 w-full">
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

                    {/* Submit Button */}
                    <div className="mb-6 flex justify-center w-full">
                        <button
                            type="submit"
                            onClick={handleClick}
                            className="px-6 py-2 bg-[#FF914D] text-white font-bold rounded-lg hover:bg-[#FFE9DB] transition flex items-center"
                        >
                            {/* Magnifying Glass Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white mr-2"
                                fill="none"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm9 0l-4-4"
                                />
                            </svg>
                            ค้นหา
                        </button>
                    </div>

                </div>
            </div>
        </div>


    );
};

export default SearchPage;
