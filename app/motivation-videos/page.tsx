"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
// Layout import kaldırıldı - kendi layout'unu kullanacak

interface Video {
  id: string;
  date: string;
  title: string;
  videoId: string;
  description: string;
  isActive: boolean;
  isFavorite?: boolean;
  watchCount?: number;
  lastWatched?: string;
}

interface FilterOptions {
  showFavorites: boolean;
  showRecent: boolean;
  searchTerm: string;
  sortBy: "newest" | "oldest" | "mostWatched" | "title";
}

export default function MotivationVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    showFavorites: false,
    showRecent: false,
    searchTerm: "",
    sortBy: "newest",
  });

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, filters]);

  const fetchVideos = async () => {
    try {
      setLoading(true);

      // Fetch videos from daily_videos table
      const { data: videosData, error: videosError } = await supabase
        .from("daily_videos")
        .select("*")
        .eq("is_active", true)
        .order("date", { ascending: false });

      if (videosError) throw videosError;

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user's favorite videos
      const { data: favoritesData } = await supabase
        .from("user_favorite_videos")
        .select("video_id")
        .eq("user_id", user.id);

      // Fetch watch statistics
      const { data: watchStatsData } = await supabase
        .from("video_watch_stats")
        .select("video_id, watched_at, completed")
        .eq("user_id", user.id)
        .eq("completed", true);

      const favoriteIds = new Set(favoritesData?.map((f) => f.video_id) || []);
      const watchStats = new Map();

      watchStatsData?.forEach((stat) => {
        if (!watchStats.has(stat.video_id)) {
          watchStats.set(stat.video_id, {
            count: 0,
            lastWatched: stat.watched_at,
          });
        }
        watchStats.get(stat.video_id).count++;
      });

      // Format videos with additional data
      const formattedVideos: Video[] = (videosData || []).map((video) => ({
        id: video.id,
        date: video.date,
        title: video.title,
        videoId: video.video_id,
        description: video.description || "",
        isActive: video.is_active,
        isFavorite: favoriteIds.has(video.id),
        watchCount: watchStats.get(video.id)?.count || 0,
        lastWatched: watchStats.get(video.id)?.lastWatched,
      }));

      setVideos(formattedVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...videos];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchLower) ||
          video.description.toLowerCase().includes(searchLower),
      );
    }

    // Favorites filter
    if (filters.showFavorites) {
      filtered = filtered.filter((video) => video.isFavorite);
    }

    // Recent filter (last 7 days)
    if (filters.showRecent) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((video) => new Date(video.date) >= weekAgo);
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        break;
      case "mostWatched":
        filtered.sort((a, b) => (b.watchCount || 0) - (a.watchCount || 0));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredVideos(filtered);
  };

  const toggleFavorite = async (videoId: string) => {
    try {
      setFavoriteLoading(videoId);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const video = videos.find((v) => v.id === videoId);
      if (!video) return;

      if (video.isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("user_favorite_videos")
          .delete()
          .eq("user_id", user.id)
          .eq("video_id", videoId);

        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase.from("user_favorite_videos").insert({
          user_id: user.id,
          video_id: videoId,
        });

        if (error) throw error;
      }

      // Update local state
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, isFavorite: !v.isFavorite } : v,
        ),
      );

      // Show success toast
      setToast({
        message: video.isFavorite
          ? "Favorilerden çıkarıldı!"
          : "Favorilere eklendi!",
        type: "success",
      });

      // Auto-hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setToast({
        message: "Favori durumu güncellenirken bir hata oluştu!",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setFavoriteLoading(null);
    }
  };

  const recordWatch = async (videoId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Record watch statistics
      const { error } = await supabase.from("video_watch_stats").insert({
        user_id: user.id,
        video_id: videoId,
        completed: true,
        watch_duration_seconds: 0, // We'll track this if needed
      });

      if (error) throw error;

      // Update local state
      setVideos((prev) =>
        prev.map((v) => {
          if (v.id === videoId) {
            return {
              ...v,
              watchCount: (v.watchCount || 0) + 1,
              lastWatched: new Date().toISOString(),
            };
          }
          return v;
        }),
      );
    } catch (error) {
      console.error("Error recording watch:", error);
    }
  };

  const openVideo = (video: Video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
    recordWatch(video.id);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Videolar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎬 Motivasyon Videoları
          </h1>
          <p className="text-gray-600">
            Hedeflerinize ulaşmanız için özel olarak hazırlanmış motivasyon
            videoları
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Video ara..."
                  value={filters.searchTerm}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchTerm: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    showFavorites: !prev.showFavorites,
                  }))
                }
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filters.showFavorites
                    ? "bg-purple-500 text-white border-purple-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <i className="ri-heart-line mr-2"></i>
                Favoriler
              </button>

              <button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    showRecent: !prev.showRecent,
                  }))
                }
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filters.showRecent
                    ? "bg-purple-500 text-white border-purple-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <i className="ri-time-line mr-2"></i>
                Son 7 Gün
              </button>
            </div>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="mostWatched">En Çok İzlenen</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Toplam Video</p>
                <p className="text-3xl font-bold">{videos.length}</p>
              </div>
              <i className="ri-video-line text-4xl opacity-80"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">Favori Video</p>
                <p className="text-3xl font-bold">
                  {videos.filter((v) => v.isFavorite).length}
                </p>
              </div>
              <i className="ri-heart-fill text-4xl opacity-80"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Toplam İzleme</p>
                <p className="text-3xl font-bold">
                  {videos.reduce((sum, v) => sum + (v.watchCount || 0), 0)}
                </p>
              </div>
              <i className="ri-eye-line text-4xl opacity-80"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">İzlenen Video</p>
                <p className="text-3xl font-bold">
                  {
                    videos.filter((v) => v.watchCount && v.watchCount > 0)
                      .length
                  }
                </p>
              </div>
              <i className="ri-check-line text-4xl opacity-80"></i>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative h-48">
                <Image
                  src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={video.title}
                  fill
                  className="object-cover cursor-pointer"
                  onClick={() => openVideo(video)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity">
                    <i className="ri-play-circle-fill text-white text-6xl"></i>
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(video.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all"
                >
                  <i
                    className={`${video.isFavorite ? "ri-heart-fill text-red-500" : "ri-heart-line text-gray-600"} text-xl`}
                  ></i>
                </button>

                {/* Watch Count Badge */}
                {video.watchCount && video.watchCount > 0 && (
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
                    <i className="ri-eye-line mr-1"></i>
                    {video.watchCount}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                    {video.title}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {new Date(video.date).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {video.description}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => openVideo(video)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                  >
                    <i className="ri-play-line mr-2"></i>
                    İzle
                  </button>

                  <div className="flex items-center text-sm text-gray-500">
                    {video.lastWatched && (
                      <span className="mr-4">
                        <i className="ri-time-line mr-1"></i>
                        {new Date(video.lastWatched).toLocaleDateString(
                          "tr-TR",
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && !loading && (
          <div className="text-center py-12">
            <i className="ri-video-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Video Bulunamadı
            </h3>
            <p className="text-gray-600">
              {filters.searchTerm || filters.showFavorites || filters.showRecent
                ? "Arama kriterlerinize uygun video bulunamadı."
                : "Henüz motivasyon videosu eklenmemiş."}
            </p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedVideo.title}
              </h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    <i className="ri-calendar-line mr-1"></i>
                    {new Date(selectedVideo.date).toLocaleDateString("tr-TR")}
                  </span>

                  {selectedVideo.watchCount && selectedVideo.watchCount > 0 && (
                    <span className="text-sm text-gray-500">
                      <i className="ri-eye-line mr-1"></i>
                      {selectedVideo.watchCount} izleme
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleFavorite(selectedVideo.id)}
                  disabled={favoriteLoading === selectedVideo.id}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedVideo.isFavorite
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  } ${favoriteLoading === selectedVideo.id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {favoriteLoading === selectedVideo.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2 inline-block"></div>
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <i
                        className={`${selectedVideo.isFavorite ? "ri-heart-fill" : "ri-heart-line"} mr-2`}
                      ></i>
                      {selectedVideo.isFavorite
                        ? "Favorilerden Çıkar"
                        : "Favorilere Ekle"}
                    </>
                  )}
                </button>
              </div>

              <p className="text-gray-700 mt-4">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>{toast.type === "success" ? "✅" : "❌"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
