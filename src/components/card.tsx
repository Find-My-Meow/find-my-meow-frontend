import { useEffect, useState } from 'react';

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
  gender:string
}

const Card = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Fetch posts from the backend API
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8000/posts/');
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
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post, index) => (
        <div key={index} className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
          {post.image_path ? (
            <img
              className="w-full h-48 object-cover"
              src={`http://127.0.0.1:8000${post.image_path}`} // Prepend base URL for relative paths
              alt={`${post.title},${post.gender}, ${post.breed}, ${post.color}, ${post.province}, ${post.district}, ${post.sub_district}, ${post.cat_info}`} // Add all data to `alt`
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <ul className="text-gray-700 text-base mb-4">
            <li><strong>เพศ:</strong> {post.gender}</li>
              <li><strong>สี:</strong> {post.color}</li>
              <li><strong>พันธุ์:</strong> {post.breed}</li>
              
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
