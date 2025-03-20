import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
}

const CatDetail = () => {
  const { post_id } = useParams(); // Get post_id from URL
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();

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
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    if (post_id) {
      fetchPostDetail();
    }
  }, [post_id]);

  const handleEdit = () => {
    navigate(`/cat-detail/${post_id}/edit`); // Redirect to edit page
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/v1/posts/${post_id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete post");
        }
        alert("Post deleted successfully!");
        navigate("/"); // Redirect to homepage or another page after deletion
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post.");
      }
    }
  };

  if (!post) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="h-full flex justify-center mt-10">
      <div className="rounded-lg bg-[#FFE9DB] shadow-lg p-6 w-[50rem] flex">
        {/* Image on the left */}
        {post.cat_image.image_path && (
          <img
            className="w-64 h-64 object-cover rounded-lg mr-6"
            src={`${post.cat_image.image_path}`}
            alt={post.cat_name || "Cat Image"}
          />
        )}

        {/* Information & Buttons on the right */}
        <div className="w-full flex flex-col justify-between">
          <div>
            <h1 className="text-[#FF914D] text-3xl font-bold text-center mb-4">
              {post.cat_name || ""}
            </h1>

            <ul className="space-y-2 text-gray-800">
              <li>
              <strong className="text-[#FF914D]">เพศ:</strong> {post.gender === 'female' ? 'เพศเมีย' : 'เพศผู้'}
              </li>
              <li>
                <strong className="text-[#FF914D]">สี:</strong> {post.color}
              </li>
              <li>
                <strong className="text-[#FF914D]">พันธุ์:</strong> {post.breed}
              </li>
              <li>
                <strong className="text-[#FF914D]">ลักษณะพิเศษ:</strong>{" "}
                {post.cat_marking}
              </li>
              <li>
                <strong className="text-[#FF914D]">สถานที่พบ:</strong>
                แขวง{post.location.sub_district} เขต{post.location.district}{" "}
                {post.location.province}
              </li>
              {post.lost_date && (
                <li>
                  <strong className="text-[#FF914D]">วันที่พบ:</strong>{" "}
                  {new Date(post.lost_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </li>
              )}
              {post.other_information && (
                <li>
                  <strong className="text-[#FF914D]">ข้อมูลเพิ่มเติม:</strong>{" "}
                  {post.other_information}
                </li>
              )}
            </ul>
          </div>

          {/* Edit & Delete Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-[#FF914D] text-white rounded-lg hover:bg-[#4DB5FF] transition"
              onClick={handleEdit}
            >
              แก้ไข
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:[#FF5439] transition"
              onClick={handleDelete}
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDetail;
