import { useLocation, useNavigate } from "react-router-dom";
import DefaultButton from "../components/DefaultButton";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <div className="h-full">
      {/* Title */}
      <div className="flex justify-center items-start">
        <h1 className="text-3xl font-bold">ผลการค้นหา</h1>
      </div>

      {/* Search Again Button */}
      <div className="flex justify-end pt-4 mt-2 font-semibold">
        <DefaultButton title="ค้นหาใหม่" color="primary" onClick={() => navigate("/search-cat")} />
      </div>

      {/* Display Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {searchResults.length > 0 ? (
          searchResults.map((post: any) => (
            <div key={post.post_id} className="border p-4 rounded-lg shadow-lg">
              <img src={post.cat_image.image_path} alt="Cat" className="w-full h-48 object-cover rounded-md" />
              <h2 className="text-lg font-bold mt-2">{post.cat_name || "ไม่ระบุชื่อ"}</h2>
              <p className="text-gray-600">{post.location.province}, {post.location.district}, {post.location.sub_district}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-6">ไม่พบข้อมูลที่ตรงกับตำแหน่งที่เลือก</p>
        )}
      </div>
    </div>
  );
};

export default Result;
