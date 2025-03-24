import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบโพสต์นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });
  
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${post_id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete post");
        }
  
        await Swal.fire({
          icon: "success",
          title: "ลบโพสต์สำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
  
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบโพสต์ได้", "error");
      }
    }
  };
  


  if (!post) {
    return <div className="text-center mt-10">Loading...</div>;
  }
  // Inside the component
  const handleTogglePostStatus = async () => {
    const isClosing = post?.status === "active";
  
    const result = await Swal.fire({
      title: isClosing ? "ยืนยันการปิดโพสต์?" : "เปิดโพสต์อีกครั้ง?",
      text: isClosing
        ? "เมื่อปิดโพสต์แล้ว จะไม่สามารถแก้ไขหรือแสดงผลได้อีก"
        : "โพสต์จะกลับมาแสดงในระบบอีกครั้ง",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: isClosing ? "ปิดโพสต์" : "เปิดโพสต์",
      cancelButtonText: "ยกเลิก",
    });
  
    if (result.isConfirmed) {
      try {
        const formData = new FormData();
        formData.append("status", isClosing ? "close" : "active");
  
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/${post_id}/status`,
          {
            method: "PATCH",
            body: formData,
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to update post status");
        }
  
        const updatedPost = await response.json();
        setPost(updatedPost);
  
        await Swal.fire({
          icon: "success",
          title: isClosing ? "ปิดโพสต์เรียบร้อยแล้ว!" : "เปิดโพสต์เรียบร้อยแล้ว!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          if (post.post_type === "lost") {
            navigate("/lost-cat");
          } else if (post.post_type === "found") {
            navigate("/found-cat");
          } else if (post.post_type === "adoption") {
            navigate("/adopt-cat");
          } else {
            navigate("/");
          }
        });;
      } catch (error) {
        console.error("Error updating post status:", error);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะโพสต์ได้", "error");
      }
    }
  };
  


  return (
    <div className="flex items-center justify-center mb-10">
      <div className="w-full max-w-5xl bg-[#FFE9DB] shadow-xl rounded-2xl p-6 relative">
        {/* Close Button */}
        {isOwner && (
  <div className="flex justify-end mb-4 items-center gap-3">
    <span className="text-sm text-gray-700">
      {post.status === "active" ? "สถานะ: เปิดอยู่" : "สถานะ: ปิดโพสต์แล้ว"}
    </span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={post.status === "active"}
        onChange={handleTogglePostStatus}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-300"></div>
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-full" />
    </label>
  </div>
)}



        {/* Main Content */}
        <div className="md:flex gap-6 mt-10 rounded-xl overflow-hidden mb-6">
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
          <div className="flex justify-end gap-4">
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
