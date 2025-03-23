import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
const CatDetail = () => {
  const { post_id } = useParams(); // Get post_id from URL
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("user_id");
  const isOwner = post?.user_id === currentUserId;

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
  // Inside the component
  const handleClosePost = async () => {
    try {
      const formData = new FormData();
      formData.append("status", "close");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${post_id}/status`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to close the post");
      }

      const updatedPost = await response.json();
      setPost(updatedPost); // update UI
      alert("ปิดโพสต์เรียบร้อยแล้ว");
    } catch (error) {
      console.error("Error closing post:", error);
      alert("ไม่สามารถปิดโพสต์ได้");
    }
  };

  return (
    <div className="flex items-center justify-center mb-10">
      <div className="w-full max-w-5xl bg-[#FFE9DB] shadow-xl rounded-2xl p-6 relative">
        {/* Close Button */}
        {isOwner && (
          <button
            className="absolute top-4 right-4 px-4 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition"
            onClick={handleClosePost}
          >
            ปิดโพสต์
          </button>
        )}

        {/* Main Content */}
        <div className="md:flex gap-6 mt-10 rounded-xl overflow-hidden">
          {/* Left: Image */}
          <div className="md:w-1/2 w-full flex items-center justify-center p-4 bg-white rounded-xl">
            {post.cat_image.image_path && (
              <img
                src={post.cat_image.image_path}
                alt={post.cat_name || "Cat Image"}
                className="max-h-[26rem] w-full object-contain"
              />
            )}
          </div>

          {/* Right: Info */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Cat Name (Title) */}
            {post.post_type === "lost" && post.cat_name && (
              <h1 className="text-3xl font-bold text-center text-[#FF914D] mb-3">
                {post.cat_name}
              </h1>
            )}
            {/* Cat Info */}
            <ul className="space-y-2 text-gray-800 text-lg">
              <li>
                <strong className="text-[#FF914D]">เพศ:</strong>{" "}
                {post.gender === "female" ? "เพศเมีย" : "เพศผู้"}
              </li>
              <li>
                <strong className="text-[#FF914D]">สี:</strong> {post.color}
              </li>
              <li>
                <strong className="text-[#FF914D]">สายพันธุ์:</strong>{" "}
                {post.breed}
              </li>
              <li>
                <strong className="text-[#FF914D]">จุดสังเกต:</strong>{" "}
                {post.cat_marking || "-"}
              </li>
              <li>
                <strong className="text-[#FF914D]">ข้อมูลเพิ่มเติม:</strong>{" "}
                {post.other_information || "-"}
              </li>

              {post.post_type === "lost" && post.lost_date && (
                <li>
                  <strong className="text-[#FF914D]">วันที่หาย:</strong>{" "}
                  {new Date(post.lost_date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </li>
              )}
            </ul>

            {/* Map */}
            {post.location?.latitude && post.location?.longitude && (
              <div className="mt-2">
                <h2 className="text-lg font-bold text-[#FF914D] mb-2">
                  ตำแหน่งที่พบ
                </h2>
                <div className="w-full h-60 rounded-lg overflow-hidden">
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={{
                      lat: Number(post.location.latitude),
                      lng: Number(post.location.longitude),
                    }}
                    zoom={15}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                    }}
                  >
                    <Marker
                      position={{
                        lat: Number(post.location.latitude),
                        lng: Number(post.location.longitude),
                      }}
                    />
                  </GoogleMap>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Buttons */}
        {isOwner && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              className="px-4 py-2 bg-[#FF914D] text-white font-semibold rounded-lg hover:bg-orange-500 transition"
              onClick={handleEdit}
            >
              แก้ไข
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              onClick={handleDelete}
            >
              ลบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatDetail;
