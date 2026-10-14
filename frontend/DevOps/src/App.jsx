import { useState } from "react";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchUser = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const response = await fetch(
        `https://api.github.com/bhavithram2006/${encodeURIComponent(
          username.trim()
        )}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("GitHub user not found.");
        }
        if (response.status === 403) {
          throw new Error("API rate limit exceeded. Try again later.");
        }
        throw new Error("Unable to fetch GitHub user.");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <div className="container">
        <h1>
          GitHub <span>User Finder</span>
        </h1>

        <p className="subtitle">
          Search GitHub profiles by username
        </p>

        <form className="search-form" onSubmit={searchUser}>
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="GitHub username"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {loading && <p className="message">Loading profile...</p>}

        {user && (
          <section className="profile">
            <img
              className="avatar"
              src={user.avatar_url}
              alt={`${user.login}'s avatar`}
            />

            <h2>{user.name || user.login}</h2>
            <p className="username">@{user.login}</p>

            {user.bio && <p className="bio">{user.bio}</p>}

            <div className="stats">
              <div>
                <strong>{user.public_repos}</strong>
                <span>Repositories</span>
              </div>

              <div>
                <strong>{user.followers}</strong>
                <span>Followers</span>
              </div>

              <div>
                <strong>{user.following}</strong>
                <span>Following</span>
              </div>
            </div>

            <div className="details">
              {user.location && (
                <p> {user.location}</p>
              )}

              {user.company && (
                <p>{user.company}</p>
              )}

              {user.blog && (
                <p>
                  {" "}
                  <a
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    {user.blog}
                  </a>
                </p>
              )}

              <p>
                Joined{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>

            <a
              className="profile-link"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              View GitHub Profile
            </a>
          </section>
        )}

        {!user && !loading && !error && (
          <p className="message">
            Enter a username to discover a GitHub profile.
          </p>
        )}
      </div>
    </main>
  );
}