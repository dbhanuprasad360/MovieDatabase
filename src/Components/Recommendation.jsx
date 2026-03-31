import React, { useContext, useState } from "react";
import { MovieContext } from "./MovieContext";

const Recommendations = () => {
  const { watchList } = useContext(MovieContext);
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    setLoading(true);

    const titles = watchList
      .slice(0, 5)
      .map((m) => m.title)
      .join(", ");
    const prompt = `Based on these 5 movies: ${titles}, recommend 5 similar movies with short descriptions.`;

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/bigscience/bloom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      const data = await response.json();
      setRecommendations(data.generated_text || "No response.");
    } catch (err) {
      setRecommendations("Failed to get recommendations.");
    }

    setLoading(false);
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5 text-green-500">
        AI Movie Recommendations
      </h1>

      <button
        onClick={handleRecommend}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Get Recommendations
      </button>

      {loading && <p className="mt-5">Loading...</p>}

      {!loading && recommendations && (
        <div className="mt-5 whitespace-pre-wrap bg-black/10 p-4 rounded-md">
          {recommendations}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
