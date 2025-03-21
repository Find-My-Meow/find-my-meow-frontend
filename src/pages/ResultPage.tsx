import { useLocation, useNavigate } from "react-router-dom";
import DefaultButton from "../components/DefaultButton";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <div className="h-full px-6 pb-20">
      {/* Title */}
      <div className="flex justify-center items-start mt-10">
        <h1 className="text-3xl font-bold">ผลการค้นหา</h1>
      </div>

      {/* Search Again Button */}
      <div className="flex justify-end pt-4 mt-2">
        <DefaultButton
          title="ค้นหาใหม่"
          color="primary"
          onClick={() => navigate("/search-cat")}
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-20 gap-y-10 mt-8">
        {searchResults.length > 0 ? (
          searchResults.map((post: any) => (
            <div
              key={post.post_id}
              onClick={() => navigate(`/cat-detail/${post.post_id}`)}
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
                    <strong className="text-[#FF914D]">สี:</strong> {post.color}
                  </li>
                  <li>
                    <strong className="text-[#FF914D]">พันธุ์:</strong>{" "}
                    {post.breed}
                  </li>
                  <li>
                    <strong className="text-[#FF914D]">
                      {post.post_type === "lost"
                        ? "สถานที่หาย:"
                        : post.post_type === "found"
                          ? "สถานที่พบ:"
                          : "สถานที่:"}
                    </strong>{" "}
                    แขวง{post.location.sub_district} เขต{post.location.district}{" "}
                    {post.location.province}
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
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-6">
            ไม่พบข้อมูลที่ตรงกับตำแหน่งที่เลือก
          </p>
        )}
      </div>
    </div>
  );
};

export default Result;
