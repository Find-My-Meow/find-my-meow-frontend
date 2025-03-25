import { useLocation, useNavigate } from "react-router-dom";
import DefaultButton from "../components/DefaultButton";
import { useEffect, useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { MdErrorOutline } from "react-icons/md";
import { TbCat } from "react-icons/tb";
import Swal from "sweetalert2";

const Result = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { image, location, radius } = routerLocation.state || {};
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noCatDetected, setNoCatDetected] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const searchCalled = useRef(false);

  const filteredResults =
    selectedType === "all"
      ? results
      : results.filter((post: any) => post.post_type === selectedType);

  useEffect(() => {
    // prevent double call search api
    if (searchCalled.current) return;
    searchCalled.current = true;

    const searchCats = async () => {
      const formData = new FormData();

      if (image) {
        formData.append("file", image);
      }

      if (location) {
        formData.append("latitude", location.lat);
        formData.append("longitude", location.lng);
        formData.append("radius_km", radius || 1);
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/search/search`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            if (
              typeof data.detail === "string" &&
              data.detail === "No cat detected in image."
            ) {
              setNoCatDetected(true);
            } else if (
              typeof data.detail === "object" &&
              data.detail.message?.includes("Image is too small")
            ) {
              Swal.fire({
                icon: "warning",
                title: "รูปภาพมีขนาดเล็กเกินไป",
                text: "กรุณาเลือกรูปที่มีความละเอียดสูงกว่านี้",
              });
              setError("ไม่สามารถค้นหาได้ กรุณาลองใหม่อีกครั้ง");
            } else {
              throw new Error(
                data.detail?.message || data.detail || "Search failed"
              );
            }
            return;
          }

          throw new Error("Search failed");
        }

        if (data.image_blur_warning) {
          Swal.fire({
            icon: "warning",
            title: "รูปภาพเบลอ",
            text: "ระบบตรวจพบว่าภาพมีความเบลอ ซึ่งอาจกระทบกับผลการค้นหา ลองใช้ภาพอื่นเพื่อผลลัพธ์ที่แม่นยำยิ่งขึ้น",
          });
        }

        if (Array.isArray(data.results) && data.results.length === 0) {
          // No results but valid image/location
          setResults([]);
        } else {
          setResults(data.results);
        }
      } catch (error) {
        console.error("Search error:", error);
        setError("ไม่สามารถค้นหาได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    searchCats();
  }, [image, location]);

  return (
    <div className="h-full px-6 pb-20">
      {/* Title */}
      <div className="flex justify-center items-start mt-10">
        <h1 className="text-3xl font-bold">ผลการค้นหา</h1>
      </div>

      {loading ? (
        // loading
        <div className="flex flex-col justify-center items-center mt-28">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#FF914D"
            radius="9"
            ariaLabel="three-dots-loading"
          />
          <h1 className="text-2xl font-semibold text-[#FF914D] mb-4">
            กำลังค้นหา
          </h1>
          <h2 className="text-base italic text-gray-500 mb-4">
            การค้นหาอาจใช้เวลาสักครู่
          </h2>
        </div>
      ) : (
        <div className="">
          {/* Search Again Button */}
          <div className="flex justify-end pt-4 mt-2 font-semibold">
            <DefaultButton
              title="ค้นหาใหม่"
              color="primary"
              disabled={loading}
              onClick={() => navigate("/search-cat")}
            />
          </div>

          <div className="flex gap-2 justify-center mt-6">
            {["all", "found", "adoption", "lost"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full font-semibold border ${
                  selectedType === type
                    ? "bg-[#FF914D] text-white border-[#FF914D]"
                    : "bg-white text-[#FF914D] border-[#FF914D]"
                }`}
              >
                {type === "all"
                  ? "ทั้งหมด"
                  : type === "found"
                  ? "แมวหาเจ้าของ"
                  : type === "adoption"
                  ? "แมวหาบ้าน"
                  : "แมวหาย"}
              </button>
            ))}
          </div>

          {/* no cat */}
          {noCatDetected ? (
            <div className="flex flex-col items-center justify-center mt-28 px-4 text-center">
              <MdErrorOutline className="text-6xl text-yellow-500 mb-4" />
              <p className="text-3xl font-semibold text-yellow-500 max-w-xl">
                ไม่พบแมวในรูปภาพ
              </p>
              <p className="text-md text-gray-600 mt-2">
                กรุณาเลือกรูปใหม่ที่เห็นแมวชัดเจน
              </p>
            </div>
          ) : error ? ( // Show error
            <div className="flex flex-col items-center justify-center mt-28 px-4 text-center">
              <MdErrorOutline className="text-6xl text-red-500 mb-4" />
              <p className="text-3xl font-semibold text-red-500 max-w-xl">
                เกิดข้อผิดพลาด
              </p>
              <p className="text-md text-gray-600 mt-2">{error}</p>
            </div>
          ) : filteredResults.length > 0 ? ( // results
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-20 gap-y-10 mt-8">
              {filteredResults.map((post: any) => (
                <div
                  className="cursor-pointer rounded-lg bg-[#FFE9DB] shadow-lg flex w-[35rem] h-auto"
                >
                  {/* Image */}
                  <div className="flex items-center justify-center m-4">
                    {post.cat_image?.image_path ? (
                      <img
                        className="w-56 h-56 object-cover rounded-md"
                        src={post.cat_image.image_path}
                        alt={post.cat_name || "cat"}
                      />
                    ) : (
                      <div className="w-56 h-56 bg-gray-200 flex items-center justify-center rounded-md">
                        <p>No Image</p>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 w-2/3">
                    <h2 className="text-[#FF914D] text-2xl font-semibold mb-2 text-center">
                      {post.cat_name || "ไม่ระบุชื่อ"}
                    </h2>
                    <ul className="text-sm text-gray-800 space-y-1">
                      <li>
                        <strong className="text-[#FF914D]">เพศ:</strong>{" "}
                        {post.gender === "female" ? "เพศเมีย" : "เพศผู้"}
                      </li>
                      <li>
                        <strong className="text-[#FF914D]">สี:</strong>{" "}
                        {post.color}
                      </li>
                      <li>
                        <strong className="text-[#FF914D]">สายพันธุ์:</strong>{" "}
                        {post.breed}
                      </li>
                    </ul>
                    {post.post_type === "lost" && post.lost_date && (
                      <p className="text-sm text-gray-800 mt-2">
                        <strong className="text-[#FF914D]">วันที่หาย:</strong>{" "}
                        {new Date(post.lost_date).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </p>
                    )}
                     <div className="w-full flex justify-center mt-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering card click
                      navigate(`/cat-detail/${post.post_id}`);
                    }}
                    className="px-4 py-2 bg-[#FF914D] text-white font-semibold rounded-lg hover:bg-orange-500 transition whitespace-nowrap"
                  >
                    เพิ่มเติม
                  </button>
                </div>
                  </div>
                </div>
              ))}
              
            </div>
          ) : (
            // post not found
            <div className="flex flex-col items-center justify-center mt-28 px-4 text-center">
              <TbCat className="text-5xl text-[#FF914D] mb-4" />
              <p className="text-2xl font-semibold text-[#FF914D] max-w-xl">
                ไม่พบโพสต์ที่ตรงกับเงื่อนไข
              </p>
              <p className="text-md text-gray-600 mt-2">
                กรุณาลองใหม่อีกครั้ง หรือเปลี่ยนเงื่อนไขการค้นหา
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Result;
