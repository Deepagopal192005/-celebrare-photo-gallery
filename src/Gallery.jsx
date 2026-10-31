import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Heart, Search, Camera, ImageOff, RefreshCw } from "lucide-react";
import useFetchPhotos from "./hooks/useFetchPhotos";
import {
  favouritesReducer,
  getInitialFavourites,
} from "./reducers/favouritesReducer";

function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={`https://picsum.photos/id/${photo.id}/600/450`}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={isFavourite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
          aria-pressed={isFavourite}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-md backdrop-blur transition focus:outline-none focus:ring-4 focus:ring-rose-200 ${
            isFavourite
              ? "bg-rose-500 text-white"
              : "bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500"
          }`}
        >
          <Heart size={19} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Photographer</p>
          <h2 className="mt-1 truncate text-sm font-semibold text-slate-800">{photo.author}</h2>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
          #{photo.id}
        </span>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
      <p className="text-sm font-medium text-slate-500">Loading beautiful photos…</p>
    </div>
  );
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [searchTerm, setSearchTerm] = useState("");
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    undefined,
    getInitialFavourites
  );

  // Keep the reducer-managed favourites in localStorage between visits.
  useEffect(() => {
    localStorage.setItem("celebrare-favourites", JSON.stringify(favourites));
  }, [favourites]);

  // useCallback keeps the search input handler reference stable.
  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const toggleFavourite = useCallback((photoId) => {
    dispatch({
      type: favourites.includes(photoId) ? "REMOVE_FAVOURITE" : "ADD_FAVOURITE",
      photoId,
    });
  }, [favourites]);

  // useMemo recalculates the filtered list only when photos or search changes.
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return photos;
    return photos.filter((photo) => photo.author.toLowerCase().includes(query));
  }, [photos, searchTerm]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-indigo-700">
              <Camera size={14} /> CELEBRARE · FRONTEND ASSIGNMENT
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Photo Gallery</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              A little inspiration, one photograph at a time. Search photographers and save your favourites.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Photos loaded</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{loading ? "—" : photos.length}</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
              <p className="text-xs text-rose-600">Your favourites</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-rose-700">{favourites.length}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Explore photos</h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? "Getting the gallery ready…" : `Showing ${filteredPhotos.length} of ${photos.length} photos`}
            </p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by author name…"
              aria-label="Search photos by author name"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div role="alert" className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 text-center">
            <ImageOff size={32} className="text-rose-500" />
            <h3 className="mt-4 font-semibold text-rose-900">Couldn’t load the photos</h3>
            <p className="mt-2 max-w-md text-sm text-rose-700">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
              <RefreshCw size={15} /> Try again
            </button>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <Search size={30} className="text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-800">No photographers found</h3>
            <p className="mt-1 text-sm text-slate-500">Try another author name.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavourite={favourites.includes(photo.id)}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="mx-auto max-w-7xl px-5 pb-8 text-center text-xs text-slate-400 sm:px-8 lg:px-10">
        Photos provided by Picsum Photos · Built with React, Vite and Tailwind CSS
      </footer>
    </main>
  );
}