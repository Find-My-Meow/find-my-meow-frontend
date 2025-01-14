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
  image_path: string | null;
  email_preference: string;
  gender: string;
  post_type: string;
  date?: string; // Optional date field
}

interface CardProps {
  postType: string;
}

const Card = ({ postType }: CardProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/posts/?type=${postType}`
        );
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
          className="rounded-lg bg-[#FFE9DB] shadow-lg flex w-[35rem] min-h-[35-rem] h-auto"
        >
          <div className="flex items-center justify-center m-4">
            {post.image_path ? (
              <img
                className="w-56 h-56 object-cover"
                src={`http://127.0.0.1:8000${post.image_path}`}
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
              {post.title}
            </h2>
            <ul className="text-sm text-gray-800 space-y-1">
              <li>
                <strong className="text-[#FF914D]">เพศ:</strong> {post.gender}
              </li>
              <li>
                <strong className="text-[#FF914D]">สี:</strong> {post.color}
              </li>
              <li>
                <strong className="text-[#FF914D]">พันธุ์:</strong> {post.breed}
              </li>
              <li>
                <strong className="text-[#FF914D]">
                  {postType === "lostcat"
                    ? "สถานที่หาย:"
                    : postType === "foundcat"
                    ? "สถานที่พบ:"
                    : "สถานที่:"}
                </strong>{" "}
                แขวง{post.sub_district} เขต{post.district} {post.province}
              </li>
            </ul>
            {postType === "lostcat" && post.date && (
              <p className="text-sm text-gray-800 mt-2">
                <strong className="text-[#FF914D]">วันที่หาย:</strong>{" "}
                {post.date}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
