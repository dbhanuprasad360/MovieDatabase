// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Link } from "react-router-dom";

// function PeopleDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [person, setPerson] = useState(null);
//   const [knownFor, setKnownFor] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [mediaFilter, setMediaFilter] = useState("all"); // all, movie, tv
//   const [sortBy, setSortBy] = useState("date"); // rating, date, popularity
//   const [roleFilter, setRoleFilter] = useState("all"); // all, main, support
//   const [backdrop, setBackdrop] = useState(null);

//   const API_KEY = import.meta.env.VITE_MOVIE_KEY;

//   useEffect(() => {
//     Promise.all([
//       axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`),
//       axios.get(
//         `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}`,
//       ),
//     ])
//       .then(([personRes, creditsRes]) => {
//         setPerson(personRes.data);

//         const allCredits = creditsRes.data.cast;

//         // STEP 1 — remove items with no poster or no rating
//         const filtered = allCredits.filter(
//           (item) => item.poster_path && item.vote_average > 0,
//         );

//         // STEP 2 — deduplicate by id + media_type
//         // if same show appears twice, keep the one with lower order (more important role)
//         const seen = new Map();
//         filtered.forEach((item) => {
//           const key = `${item.id}-${item.media_type}`;
//           if (!seen.has(key)) {
//             seen.set(key, item);
//           } else {
//             // keep the entry with lower order number (= more important role)
//             const existing = seen.get(key);
//             if (item.order < existing.order) {
//               seen.set(key, item);
//             }
//           }
//         });

//         const deduplicated = Array.from(seen.values());
//         const topItem = [...deduplicated].sort(
//           (a, b) => b.vote_average - a.vote_average,
//         )[0];
//         setKnownFor(deduplicated); // clean unsorted array stored in state
//         if (topItem?.backdrop_path) {
//           setBackdrop(
//             `https://image.tmdb.org/t/p/original${topItem.backdrop_path}`,
//           );
//         }
//       })
//       .catch((err) => console.log(err))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading)
//     return (
//       <div className="w-full h-screen flex items-center justify-center bg-black text-white text-2xl">
//         Loading...
//       </div>
//     );

//   if (!person)
//     return (
//       <div className="w-full h-screen flex items-center justify-center bg-black text-white">
//         Person not found.
//       </div>
//     );

//   const photo = person.profile_path
//     ? `https://image.tmdb.org/t/p/w342${person.profile_path}`
//     : "https://via.placeholder.com/300x450?text=No+Photo";

//   return (
//     <div className="min-h-screen text-white bg-black  ">
//       {/* dark overlay so text is readable over the backdrop */}
//       {backdrop && (
//         <div
//           className="w-full h-[100vh] bg-cover bg-center relative"
//           style={{ backgroundImage: `url(${backdrop})` }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-t backdrop-blur-[2px] from-black via-black/90 to-transparent" />
//         </div>
//       )}

//       {/* wrap all existing content in a relative div so it sits above the overlay */}
//       <div className="relative z-10">
//         {/* BACK BUTTON */}
//         <button
//           onClick={() => navigate(-1)}
//           className="fixed top-[70px] left-4 z-50 bg-black/60 hover:bg-black/90
//         text-white px-4 py-2 rounded-full text-sm transition-all border border-white/20"
//         >
//           ← Back
//         </button>

//         {/* HERO SECTION — photo on left, info on right */}
//         <div
//           className={`max-w-5xl mx-auto px-6 pb-20 ${backdrop ? "-mt-[35rem]" : "mt-[62px]"}  relative z-10 pb-20 `}
//         >
//           <div className="flex flex-col md:flex-row gap-8">
//             {/* PHOTO */}
//             <img
//               src={photo}
//               alt={person.name}
//               className="w-48 md:w-72 border-white border-1 rounded-xl shadow-2xl flex-shrink-0 mx-auto md:mx-0 object-cover"
//             />

//             {/* INFO */}
//             <div className="flex flex-col gap-4">
//               <h1 className="text-4xl font-bold mt-10">{person.name}</h1>

//               {/* DETAILS */}
//               <div className="flex flex-col gap-2 text-sm text-gray-400">
//                 <span>🎭 Known for: {person.known_for_department}</span>

//                 {/* BIRTHDAY + AGE */}
//                 {person.birthday && (
//                   <span>
//                     🎂 Born: {person.birthday}{" "}
//                     {(() => {
//                       const birth = new Date(person.birthday);
//                       const end = person.deathday
//                         ? new Date(person.deathday)
//                         : new Date(); // use today if alive

//                       let years = end.getFullYear() - birth.getFullYear();
//                       let months = end.getMonth() - birth.getMonth();

//                       // adjust if months is negative
//                       if (months < 0) {
//                         years--;
//                         months += 12;
//                       }

//                       return (
//                         <span className="text-gray-500">
//                           ({years}y {months}m)
//                         </span>
//                       );
//                     })()}
//                   </span>
//                 )}

//                 {/* DEATHDAY — only show if available */}
//                 {person.deathday && (
//                   <span className="text-red-400">
//                     ✝️ Died: {person.deathday}
//                   </span>
//                 )}

//                 {person.place_of_birth && (
//                   <span>📍 {person.place_of_birth}</span>
//                 )}

//                 <span>🔥 Popularity: {person.popularity?.toFixed(1)}</span>

//                 {/* HOMEPAGE — only show if available */}
//                 {person.homepage && (
//                   <a
//                     href={person.homepage}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
//                   >
//                     🌐 Official Website
//                   </a>
//                 )}
//               </div>

//               {/* BIOGRAPHY */}
//               {person.biography ? (
//                 <div>
//                   <h2 className="text-xl mt-10 font-bold mb-2">Biography</h2>
//                   <p className="text-gray-300 leading-relaxed line-clamp-6">
//                     {person.biography}
//                   </p>
//                   {/* line-clamp-6 limits to 6 lines — keeps it clean */}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No biography available.</p>
//               )}
//             </div>
//           </div>

//           {/* KNOWN FOR SECTION */}
//           {knownFor.length > 0 && (
//             <div className="mt-12">
//               <h2 className="text-2xl font-bold mb-4">Known For</h2>

//               {/* FILTER BAR */}
//               <div className="flex flex-wrap gap-3 mb-6">
//                 {/* Media type filter */}
//                 <select
//                   value={mediaFilter}
//                   onChange={(e) => setMediaFilter(e.target.value)}
//                   className="bg-white/10 border border-white/20 text-white text-sm
//         px-3 py-1 rounded-lg outline-none cursor-pointer hover:border-white/40 transition-colors"
//                 >
//                   <option value="all" className="bg-gray-900">
//                     🎬 All Types
//                   </option>
//                   <option value="movie" className="bg-gray-900">
//                     🎥 Movies
//                   </option>
//                   <option value="tv" className="bg-gray-900">
//                     📺 TV Shows
//                   </option>
//                 </select>

//                 {/* Sort filter */}
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="bg-white/10 border border-white/20 text-white text-sm
//         px-3 py-2 rounded-lg outline-none cursor-pointer hover:border-white/40 transition-colors"
//                 >
//                   <option value="rating" className="bg-gray-900">
//                     ⭐ Sort by Rating
//                   </option>
//                   <option value="date" className="bg-gray-900">
//                     📅 Sort by Date
//                   </option>
//                   <option value="popularity" className="bg-gray-900">
//                     🔥 Sort by Popularity
//                   </option>
//                 </select>

//                 {/* Role filter */}
//                 <select
//                   value={roleFilter}
//                   onChange={(e) => setRoleFilter(e.target.value)}
//                   className="bg-white/10 border border-white/20 text-white text-sm
//         px-3 py-2 rounded-lg outline-none cursor-pointer hover:border-white/40 transition-colors"
//                 >
//                   <option value="all" className="bg-gray-900">
//                     👤 All Roles
//                   </option>
//                   <option value="main" className="bg-gray-900">
//                     🌟 Main Role
//                   </option>
//                   <option value="support" className="bg-gray-900">
//                     🎭 Support Role
//                   </option>
//                 </select>
//               </div>

//               {/* FILTERED + SORTED RESULTS */}
//               <div className="flex flex-wrap gap-4">
//                 {knownFor
//                   // filter by media type
//                   .filter((item) =>
//                     mediaFilter === "all"
//                       ? true
//                       : item.media_type === mediaFilter,
//                   )
//                   // filter by role — TMDB gives order field, lower = more important role
//                   .filter((item) => {
//                     if (roleFilter === "all") return true;
//                     if (roleFilter === "main") return item.order < 5; // order 0-4 = main role
//                     if (roleFilter === "support") return item.order >= 5; // order 5+ = support
//                     return true;
//                   })
//                   // sort
//                   .sort((a, b) => {
//                     if (sortBy === "rating")
//                       return b.vote_average - a.vote_average;
//                     if (sortBy === "popularity")
//                       return b.popularity - a.popularity;
//                     if (sortBy === "date") {
//                       // movies use release_date, shows use first_air_date
//                       const dateA = new Date(
//                         a.release_date || a.first_air_date || 0,
//                       );
//                       const dateB = new Date(
//                         b.release_date || b.first_air_date || 0,
//                       );
//                       return dateB - dateA; // newest first
//                     }
//                     return 0;
//                   })
//                   .map((item) => (
//                     <Link
//                       to={
//                         item.media_type === "movie"
//                           ? `/movie/${item.id}`
//                           : `/tv/${item.id}`
//                       }
//                       key={`${item.id}-${item.media_type}`}
//                     >
//                       <div className="text-center w-36 hover:scale-105 transition duration-300">
//                         <img
//                           src={
//                             item.poster_path
//                               ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
//                               : "https://via.placeholder.com/144x200?text=?"
//                           }
//                           alt={item.title || item.name}
//                           className="w-36 h-48 rounded-lg object-cover mb-2 border border-white/10 hover:border-white/40 transition-colors"
//                         />
//                         <p className="text-xs text-gray-300 leading-tight">
//                           {item.title || item.name}
//                         </p>
//                         <div className="flex justify-center gap-2 mt-1">
//                           <span className="text-xs text-gray-500 capitalize">
//                             {item.media_type}
//                           </span>
//                           <span className="text-xs text-yellow-400">
//                             ⭐ {item.vote_average?.toFixed(1)}
//                           </span>
//                         </div>
//                       </div>
//                     </Link>
//                   ))}
//               </div>

//               {/* EMPTY STATE — if filters return nothing */}
//               {knownFor.filter(
//                 (item) =>
//                   (mediaFilter === "all" || item.media_type === mediaFilter) &&
//                   (roleFilter === "all" ||
//                     (roleFilter === "main" ? item.order < 5 : item.order >= 5)),
//               ).length === 0 && (
//                 <p className="text-gray-500 text-center mt-8">
//                   No results for this filter combination.
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PeopleDetail;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function PeopleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [knownFor, setKnownFor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [roleFilter, setRoleFilter] = useState("all");
  const [backdrop, setBackdrop] = useState(null);

  const API_KEY = import.meta.env.VITE_MOVIE_KEY;

  useEffect(() => {
    Promise.all([
      axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`),
      axios.get(
        `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}`,
      ),
    ])
      .then(([personRes, creditsRes]) => {
        setPerson(personRes.data);

        const allCredits = creditsRes.data.cast;
        const filtered = allCredits.filter(
          (item) => item.poster_path && item.vote_average > 0,
        );

        const seen = new Map();
        filtered.forEach((item) => {
          const key = `${item.id}-${item.media_type}`;
          if (!seen.has(key)) {
            seen.set(key, item);
          } else {
            const existing = seen.get(key);
            if (item.order < existing.order) {
              seen.set(key, item);
            }
          }
        });

        const deduplicated = Array.from(seen.values());
        const topItem = [...deduplicated].sort(
          (a, b) => b.vote_average - a.vote_average,
        )[0];
        setKnownFor(deduplicated);
        if (topItem?.backdrop_path) {
          setBackdrop(
            `https://image.tmdb.org/t/p/original${topItem.backdrop_path}`,
          );
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white text-2xl">
        Loading...
      </div>
    );

  if (!person)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        Person not found.
      </div>
    );

  const photo = person.profile_path
    ? `https://image.tmdb.org/t/p/w342${person.profile_path}`
    : "https://via.placeholder.com/300x450?text=No+Photo";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* BACKDROP — same as Movie/Show */}
      {backdrop && (
        <div
          className="w-full h-[85vh] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backdrop})` }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-t backdrop-blur-[2px]
            from-black via-black/80 to-transparent"
          />
        </div>
      )}

      {/* BACK BUTTON — same as Movie/Show */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-[70px] left-4 z-50 bg-black/60 hover:bg-black/90
        text-white px-4 py-2 rounded-full text-sm transition-all border border-white/20"
      >
        ← Back
      </button>

      {/* MAIN CONTENT — same structure as Movie/Show */}
      <div
        className={`max-w-5xl mx-auto px-6
        ${backdrop ? "-mt-[32rem]" : "pt-[62px]"}
        relative z-10 pb-20`}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* PHOTO — same sizing as poster */}
          <img
            src={photo}
            alt={person.name}
            className="w-48 md:w-64 rounded-xl border border-white/20
            shadow-2xl flex-shrink-0 mx-auto md:mx-0 object-cover"
          />

          {/* INFO */}
          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-4xl font-bold">{person.name}</h1>

            {/* DETAILS */}
            <div className="flex flex-col gap-2 text-sm text-white">
              <span>🎭 Known for: {person.known_for_department}</span>

              {person.birthday && (
                <span>
                  🎂 Born: {person.birthday}{" "}
                  {(() => {
                    const birth = new Date(person.birthday);
                    const end = person.deathday
                      ? new Date(person.deathday)
                      : new Date();
                    let years = end.getFullYear() - birth.getFullYear();
                    let months = end.getMonth() - birth.getMonth();
                    if (months < 0) {
                      years--;
                      months += 12;
                    }
                    return (
                      <span className="text-gray-500">
                        ({years}y {months}m)
                      </span>
                    );
                  })()}
                </span>
              )}

              {person.deathday && (
                <span className="text-red-400">✝️ Died: {person.deathday}</span>
              )}

              {person.place_of_birth && <span>📍 {person.place_of_birth}</span>}

              <span>🔥 Popularity: {person.popularity?.toFixed(1)}</span>

              {person.homepage && (
                <div>
                  <span>🌐</span>
                  <a
                    href={person.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  >
                    Official Website
                  </a>
                </div>
              )}
            </div>

            {/* BIOGRAPHY */}
            {person.biography ? (
              <div>
                <h2 className="text-xl font-bold mb-2">Biography</h2>
                <p className="text-gray-300 leading-relaxed line-clamp-6">
                  {person.biography}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No biography available.</p>
            )}
          </div>
        </div>

        {/* KNOWN FOR SECTION — unchanged */}
        {knownFor.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Known For</h2>

            {/* FILTER BAR */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={mediaFilter}
                onChange={(e) => setMediaFilter(e.target.value)}
                className="bg-white/10 border border-white/20 text-white text-sm
                px-3 py-1 rounded-lg outline-none cursor-pointer hover:border-white/40 transition-colors"
              >
                <option value="all" className="bg-gray-900">
                  🎬 All Types
                </option>
                <option value="movie" className="bg-gray-900">
                  🎥 Movies
                </option>
                <option value="tv" className="bg-gray-900">
                  📺 TV Shows
                </option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 text-white text-sm
                px-3 py-2 rounded-lg outline-none cursor-pointer hover:border-white/40 transition-colors"
              >
                <option value="rating" className="bg-gray-900">
                  ⭐ Sort by Rating
                </option>
                <option value="date" className="bg-gray-900">
                  📅 Sort by Date
                </option>
                <option value="popularity" className="bg-gray-900">
                  🔥 Sort by Popularity
                </option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white/10 border border-white/20 text-white text-sm
                px-3 py-2 rounded-lg outline-none cursor-pointer hover:border-white/40 transition-colors"
              >
                <option value="all" className="bg-gray-900">
                  👤 All Roles
                </option>
                <option value="main" className="bg-gray-900">
                  🌟 Main Role
                </option>
                <option value="support" className="bg-gray-900">
                  🎭 Support Role
                </option>
              </select>
            </div>

            {/* FILTERED + SORTED RESULTS */}
            <div className="flex flex-wrap gap-4">
              {knownFor
                .filter((item) =>
                  mediaFilter === "all"
                    ? true
                    : item.media_type === mediaFilter,
                )
                .filter((item) => {
                  if (roleFilter === "all") return true;
                  if (roleFilter === "main") return item.order < 5;
                  if (roleFilter === "support") return item.order >= 5;
                  return true;
                })
                .sort((a, b) => {
                  if (sortBy === "rating")
                    return b.vote_average - a.vote_average;
                  if (sortBy === "popularity")
                    return b.popularity - a.popularity;
                  if (sortBy === "date") {
                    const dateA = new Date(
                      a.release_date || a.first_air_date || 0,
                    );
                    const dateB = new Date(
                      b.release_date || b.first_air_date || 0,
                    );
                    return dateB - dateA;
                  }
                  return 0;
                })
                .map((item) => (
                  <Link
                    to={
                      item.media_type === "movie"
                        ? `/movie/${item.id}`
                        : `/tv/${item.id}`
                    }
                    key={`${item.id}-${item.media_type}`}
                  >
                    <div className="text-center w-36 hover:scale-105 transition duration-300">
                      <img
                        src={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                            : "https://via.placeholder.com/144x200?text=?"
                        }
                        alt={item.title || item.name}
                        className="w-36 h-48 rounded-lg object-cover mb-2
                        border border-white/10 hover:border-white/40 transition-colors"
                      />
                      <p className="text-xs text-gray-300 leading-tight">
                        {item.title || item.name}
                      </p>
                      <div className="flex justify-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 capitalize">
                          {item.media_type}
                        </span>
                        <span className="text-xs text-yellow-400">
                          ⭐ {item.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {/* EMPTY STATE */}
            {knownFor.filter(
              (item) =>
                (mediaFilter === "all" || item.media_type === mediaFilter) &&
                (roleFilter === "all" ||
                  (roleFilter === "main" ? item.order < 5 : item.order >= 5)),
            ).length === 0 && (
              <p className="text-gray-500 text-center mt-8">
                No results for this filter combination.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PeopleDetail;
