import { useEffect, useState } from "react";
import { PiCat } from "react-icons/pi";
import { ThreeDots } from "react-loader-spinner";

interface Post {
  user_id: string;
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
  post_type: string;
  email_notification: boolean;
  user_email: string;
  status: string;
}
interface CardProps {
  postType: string;
}

import { useNavigate } from "react-router-dom";

const Card = ({ postType }: CardProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [noPosts, setNoPosts] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      let url = "";
      const userId = localStorage.getItem("user_id");

      if (["adoption", "lost", "found"].includes(postType)) {
        url = `${import.meta.env.VITE_BACKEND_URL
          }/api/v1/posts/?post_type=${postType}`;
      } else if (userId) {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts/user/${userId}`;
      } else {
        console.warn(
          "No valid postType and no user logged in. Skipping fetch."
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(url);

        if (response.status === 404) {
          const errorData = await response.json();
          if (errorData.detail === "No posts found.") {
            setNoPosts(true);
            setPosts([]);
            return;
          }
        }

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();

        if (["adoption", "lost", "found"].includes(postType)) {
          const activePosts = data.filter(
            (post: Post) => post.status === "active"
          );
          setPosts(activePosts);
        } else {
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchPosts();
  }, [postType]);

  if (loading) {
    return (
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
          กำลังโหลดโพสต์
        </h1>
      </div>
    );
  }

  return (
    <div>
      {noPosts && (
        <div className="flex flex-col items-center justify-center mt-28 px-4 text-center">
          <PiCat className="text-5xl text-[#FF914D] mb-4" />
          <p className="text-2xl font-semibold text-[#FF914D] max-w-xl">
            ยังไม่มีโพสต์ในขณะนี้
          </p>
        </div>
      )}
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-[#FFE9DB] shadow-lg rounded-lg flex flex-col sm:flex-row w-full"
            >
              {/* Image */}
              <div className="flex items-center justify-center p-4">
                {post.cat_image?.image_path ? (
                  <img
                    src={post.cat_image.image_path}
                    alt="cat"
                    className="w-40 h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-40 h-48 bg-gray-200 flex items-center justify-center rounded-md">
                    <p>No Image</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col justify-center flex-1">
                {post.post_type === "lost" && post.cat_name && (
                  <h1 className="text-[#FF914D] text-2xl font-bold mb-2 text-center sm:text-left">
                    {post.cat_name}
                  </h1>
                )}
                <ul className="text-gray-800 space-y-1 text-sm">
                  <li>
                    <strong className="text-[#FF914D]">เพศ:</strong>{" "}
                    {post.gender === "female" ? "เพศเมีย" : "เพศผู้"}
                  </li>
                  <li>
                    <strong className="text-[#FF914D]">สี:</strong> {post.color}
                  </li>
                  <li>
                    <strong className="text-[#FF914D]">สายพันธุ์:</strong>{" "}
                    {post.breed || "ไม่รู้"}
                  </li>
                  {postType === "lost" && post.lost_date && (
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

                <div className="w-full flex justify-center sm:justify-start mt-4">
                  <button
                    onClick={() => navigate(`/cat-detail/${post.post_id}`)}
                    className="px-4 py-2 bg-[#FF914D] text-white font-semibold rounded-lg hover:bg-orange-500 transition"
                  >
                    ดูเพิ่มเติม
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Card;