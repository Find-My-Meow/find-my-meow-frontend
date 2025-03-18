import { useEffect, useState } from "react";

interface Post {
  title: string;
  color: string;
  breed: string;
  province: string;
  district: string;
  sub_district: string;
  extra_details: string;
  cat_info: string;
  cat_image: {
    image_id: string;
    image_path: string;
  };
  location: {
    province: string;
    district: string;
    sub_district: string;
  };
  cat_name?: string;
  email_preference: string;
  gender: string;
  post_type: string;
  lost_date?: string;
  post_id: string;
}
interface CardProps {
  postType: string;
}

import { useNavigate } from "react-router-dom"; // Import useNavigate

const Card = ({ postType }: CardProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchPosts = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        console.error("No user ID in localStorage");
        return;
      }

      let url = "";

      // Check if the postType is valid, otherwise fetch posts by user_id
      if (["adoption", "lost", "found"].includes(postType)) {
        // If postType is valid, fetch posts with the postType filter
        url = `${import.meta.env.VITE_BACKEND_URL
          }/api/v1/posts/?post_type=${postType}`;
      } else {
        // If postType is invalid, fetch posts by user_id
        url = `${import.meta.env.VITE_BACKEND_URL
          }/api/v1/posts/user/${userId}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [postType]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-20 gap-y-10">
      {posts.map((post, index) => (
        <div
          key={index}
          onClick={() => navigate(`/cat-detail/${post.post_id}`)}
          className="rounded-lg bg-[#FFE9DB] shadow-lg flex w-[35rem] min-h-[35-rem] h-auto"
        >
          <div className="flex items-center justify-center m-4">
            {post.cat_image.image_path ? (
              <img
                className="w-56 h-56 object-cover"
                src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/image/${post.cat_image.image_path
                  }`}
                alt={post.title}
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-300">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          <div className="p-4 w-2/3">
            <h2 className="text-[#FF914D] text-2xl font-semibold mb-2 text-center">
              {post.cat_name}
            </h2>
            <ul className="text-sm text-gray-800 space-y-1">
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
                <strong className="text-[#FF914D]">
                  {postType === "lost"
                    ? "สถานที่หาย:"
                    : postType === "found"
                      ? "สถานที่พบ:"
                      : "สถานที่:"}
                </strong>{" "}
                แขวง{post.location.sub_district} เขต{post.location.district}{" "}
                {post.location.province}
              </li>
            </ul>
            {postType === "lost" && post.lost_date && (
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
      ))}
    </div>
  );
};

export default Card;
