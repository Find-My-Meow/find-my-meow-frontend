 // Card.tsx
const Card = () => {
    return (
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
        <img
          className="w-full h-48 object-cover"
          src="https://via.placeholder.com/300"
          alt="Card Image"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">Card Title</h2>
          <p className="text-gray-700 text-base mb-4">
            This is a simple card description. It can be used to display information about something.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Read More
          </button>
        </div>
      </div>
    );
  };
  
  export default Card;
  