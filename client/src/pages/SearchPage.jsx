import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

import API from "../api/axios";
import MainLayout from "../layouts/MainLayout";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Debounced search: fires 400ms after the user stops typing,
  // instead of hitting the API on every keystroke
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const { data } = await API.get("/users/search", {
          params: { query: trimmed },
        });

        setResults(data);
      } catch (error) {
        console.log("Search error:", error);

        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">
          Search
        </h1>

        {/* SEARCH INPUT */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-zinc-600 transition">
          <FaSearch className="text-zinc-500" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username..."
            autoFocus
            className="bg-transparent outline-none text-white flex-1 placeholder:text-zinc-500"
          />
        </div>

        {/* STATES */}
        {loading && (
          <p className="text-zinc-400">
            Searching...
          </p>
        )}

        {!loading && !query.trim() && (
          <p className="text-zinc-500">
            Search for developers by name or username.
          </p>
        )}

        {!loading && searched && query.trim() && results.length === 0 && (
          <p className="text-zinc-500">
            No users found for "{query.trim()}".
          </p>
        )}

        {/* RESULTS */}
        {!loading && results.length > 0 && (
          <div className="space-y-3">
            {results.map((user) => (
              <Link
                key={user._id}
                to={`/profile/${user._id}`}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition"
              >
                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg font-bold">
                  {user.name?.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-white truncate">
                    {user.name}
                  </h2>

                  <p className="text-zinc-400 text-sm truncate">
                    @{user.username}
                  </p>

                  {user.bio && (
                    <p className="text-zinc-500 text-sm mt-1 truncate">
                      {user.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default SearchPage;
