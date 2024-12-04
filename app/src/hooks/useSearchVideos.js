// src/hooks/useSearchVideos.js
import { useState } from "react";
import { db } from "../../firebase.config"; 

const useSearchVideos = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchVideos = async (query) => {
    setLoading(true);
    setError(null);

    try {
      const videoSnapshot = await db.collection("videos").get();

      const results = await Promise.all(
        videoSnapshot.docs.map(async (doc) => {
          const video = doc.data();
          const userSnapshot = await db.collection("users").doc(video.userId).get();
          const user = userSnapshot.exists ? userSnapshot.data() : null;

          if (
            video.description.toLowerCase().includes(query.toLowerCase()) || 
            (user?.name && user.name.toLowerCase().includes(query.toLowerCase()))
          ) {
            return {
              id: doc.id,
              ...video,
              user,
            };
          }
          return null;
        })
      );

      setSearchResults(results.filter(Boolean));
    } catch (error) {
      console.error("Không có kết quả phù hợp", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { searchResults, searchVideos, loading, error };
};

export default useSearchVideos;
