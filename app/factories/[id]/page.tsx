"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { ReviewModal } from "@/src/components/ReviewModal";
import { StarRating } from "@/src/components/StarRating";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/Tabs";

interface Factory {
  id: number;
  name: string;
  operator: string | null;
  businessActivity: string | null;
  district: string | null;
  province: string | null;
  workers: number | null;
  country: string;
  type: string | null;
  phone: string | null;
}

interface Review {
  id: number;
  workerRole: string;
  countryFrom: string;
  ratingSalary: number;
  ratingOt: number;
  ratingHousing: number;
  reviewText: string;
  createdAt: string;
}

interface ReviewStats {
  count: number;
  avgSalary: number | null;
  avgOt: number | null;
  avgHousing: number | null;
  avgOverall: number | null;
}

interface ReviewsResponse {
  data: Review[];
  stats: ReviewStats;
}

type TabKey = "about" | "reviews";

export default function FactoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [factory, setFactory] = useState<Factory | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const fetchFactoryData = useCallback(async () => {
    setLoading(true);
    try {
      const [factoryRes, reviewsRes] = await Promise.all([
        fetch(`/api/factories/${id}`),
        fetch(`/api/factories/${id}/reviews`),
      ]);

      if (factoryRes.ok) {
        const factoryData = await factoryRes.json();
        setFactory(factoryData.data);
      }

      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviewsData(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching factory data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFactoryData();
  }, [fetchFactoryData]);

  const handleReviewSubmitted = () => {
    fetchFactoryData();
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      Myanmar: "🇲🇲",
      Cambodia: "🇰🇭",
      Laos: "🇱🇦",
      Vietnam: "🇻🇳",
      Thailand: "🇹🇭",
    };
    return flags[country] || "👤";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto p-4 mt-6 w-full">
          <div className="animate-pulse space-y-6">
            <div className="bg-white p-8 rounded-2xl h-64"></div>
            <div className="bg-white p-6 rounded-2xl h-48"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!factory) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto p-4 mt-6 w-full text-center py-16">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Factory not found
          </h1>
          <Link href="/factories" className="text-emerald-600 hover:underline">
            ← Back to factories
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = reviewsData?.stats;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto p-4 md:p-8 mt-6 w-full space-y-6 animate-fade-in">
        {/* Factory Hero Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full">
                  🇹🇭 Thailand
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
                  {factory.name}
                </h1>
                <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
                  📍 {[factory.district, factory.province].filter(Boolean).join(", ") || "Thailand"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={stats?.avgOverall ?? 0} size="lg" showValue />
                </div>
                <div className="text-xs text-slate-400">
                  Based on{" "}
                  <span className="font-semibold text-slate-600">
                    {stats?.count || 0}
                  </span>{" "}
                  reviews
                </div>
              </div>
            </div>

            {/* Multi-Criteria Progress Bars */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center space-y-5">
              <h3 className="font-bold text-slate-700 text-sm tracking-wide uppercase">
                Multi-Criteria Score
              </h3>

              <div className="space-y-4">
                {/* Salary */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>💰 Salary Paid On-Time</span>
                    <span className="font-semibold text-slate-700">
                      {stats?.avgSalary?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((stats?.avgSalary || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* OT */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>⏱️ OT Hours & Fairness</span>
                    <span className="font-semibold text-slate-700">
                      {stats?.avgOt?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((stats?.avgOt || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Housing */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>🏠 Housing & Dormitory Quality</span>
                    <span className="font-semibold text-slate-700">
                      {stats?.avgHousing?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${((stats?.avgHousing || 0) / 5) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {factory.businessActivity && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">About</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {factory.businessActivity}
                </p>
              </section>
            )}

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Location</span>
                  <p className="text-slate-700 font-medium">
                    {[factory.district, factory.province].filter(Boolean).join(", ") || "Thailand"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Workers</span>
                  <p className="text-slate-700 font-medium">
                    {factory.workers?.toLocaleString() || "—"}
                  </p>
                </div>
                {factory.operator && (
                  <div>
                    <span className="text-slate-400">Operator</span>
                    <p className="text-slate-700 font-medium">{factory.operator}</p>
                  </div>
                )}
                {factory.type && (
                  <div>
                    <span className="text-slate-400">Type</span>
                    <p className="text-slate-700 font-medium">{factory.type}</p>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex justify-between items-center mt-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                🗣️ Worker Reviews
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {stats?.count || 0}
                </span>
              </h2>
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition hover:shadow-md active:scale-95 flex items-center gap-1.5"
              >
                ✏️ Write a Review
              </button>
            </div>

            {/* Reviews Feed */}
            <div className="space-y-4">
              {!reviewsData?.data || reviewsData.data.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border text-center text-slate-400">
                  No reviews yet. Be the first to write a review!
                </div>
              ) : (
                reviewsData.data.map((review) => {
                  const overallRating =
                    (review.ratingSalary + review.ratingOt + review.ratingHousing) /
                      3;

                  return (
                    <div
                      key={review.id}
                      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition duration-300 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-inner">
                            {review.workerRole.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1">
                              {review.workerRole}{" "}
                              {getCountryFlag(review.countryFrom)}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">
                              From {review.countryFrom} • Submitted{" "}
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center">
                          <StarRating rating={overallRating} size="sm" showValue />
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        {review.reviewText}
                      </p>

                      <div className="flex gap-4 text-xs text-slate-400 border-t border-slate-50 pt-3 font-medium">
                        <span className="flex items-center gap-1">
                          💰 Salary:{" "}
                          <strong className="text-slate-600">
                            {review.ratingSalary}/5
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ OT:{" "}
                          <strong className="text-slate-600">
                            {review.ratingOt}/5
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          🏠 Housing:{" "}
                          <strong className="text-slate-600">
                            {review.ratingHousing}/5
                          </strong>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Back link */}
        <div className="pt-2">
          <Link
            href="/factories"
            className="text-emerald-600 hover:underline text-sm font-medium"
          >
            ← Back to all factories
          </Link>
        </div>
      </main>

      <Footer />

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        factoryId={parseInt(id)}
        factoryName={factory.name}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
