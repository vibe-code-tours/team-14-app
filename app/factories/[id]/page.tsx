"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { ReviewModal } from "@/src/components/ReviewModal";
import { AlertModal } from "@/src/components/AlertModal";
import { StarRating } from "@/src/components/StarRating";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/Tabs";
import { useLanguage } from "@/src/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const router = useRouter();
  const { status } = useSession();
  const [factory, setFactory] = useState<Factory | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);
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

  const handleWriteReviewClick = () => {
    if (status !== "authenticated") {
      setLoginAlertOpen(true);
      return;
    }
    setShowReviewModal(true);
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto p-4 mt-6 w-full">
          <div className="animate-pulse space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl h-64"></div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl h-48"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!factory) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto p-4 mt-6 w-full text-center py-16">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            {t("factoryDetail.notFound")}
          </h1>
          <Link href="/factories" className="text-emerald-600 hover:underline">
            {t("factoryDetail.backToFactories")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = reviewsData?.stats;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto p-4 md:p-8 mt-6 w-full space-y-6 animate-fade-in">
        {/* Factory Hero Card */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full">
                  {t("factoryDetail.thailand")}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                  {factory.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 text-sm">
                  📍 {[factory.district, factory.province].filter(Boolean).join(", ") || "Thailand"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={stats?.avgOverall ?? 0} size="lg" showValue />
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  {t("factoryDetail.basedOn").replace("{count}", String(stats?.count || 0))}
                </div>
              </div>
            </div>

            {/* Multi-Criteria Progress Bars */}
            <div className="bg-slate-50/50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-center space-y-5">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wide uppercase">
                {t("factoryDetail.multiCriteriaScore")}
              </h3>

              <div className="space-y-4">
                {/* Salary */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>{t("factoryDetail.salaryScore")}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {stats?.avgSalary?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((stats?.avgSalary || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* OT */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>{t("factoryDetail.otScore")}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {stats?.avgOt?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((stats?.avgOt || 0) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Housing */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>{t("factoryDetail.housingScore")}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {stats?.avgHousing?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
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
            <TabsTrigger value="about">{t("factoryDetail.aboutTab")}</TabsTrigger>
            <TabsTrigger value="reviews">{t("factoryDetail.reviewsTab")}</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            {factory.businessActivity && (
              <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t("factoryDetail.aboutSection")}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                  {factory.businessActivity}
                </p>
              </section>
            )}

            <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{t("factoryDetail.detailsSection")}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400 dark:text-slate-500">{t("factoryDetail.location")}</span>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">
                    {[factory.district, factory.province].filter(Boolean).join(", ") || "Thailand"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">{t("factoryDetail.workers")}</span>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">
                    {factory.workers?.toLocaleString() || "—"}
                  </p>
                </div>
                {factory.operator && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">{t("factoryDetail.operator")}</span>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">{factory.operator}</p>
                  </div>
                )}
                {factory.type && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">{t("factoryDetail.type")}</span>
                    <p className="text-slate-700 dark:text-slate-200 font-medium">{factory.type}</p>
                  </div>
                )}
              </div>
            </section>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex justify-between items-center mt-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {t("factoryDetail.workerReviews")}
                <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  {stats?.count || 0}
                </span>
              </h2>
              <button
                onClick={handleWriteReviewClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition hover:shadow-md active:scale-95 flex items-center gap-1.5"
              >
                ✏️ {t("nav.writeReview")}
              </button>
            </div>

            {/* Reviews Feed */}
            <div className="space-y-4">
              {!reviewsData?.data || reviewsData.data.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border text-center text-slate-400 dark:text-slate-500">
                  {t("factoryDetail.noReviews")}
                </div>
              ) : (
                reviewsData.data.map((review) => {
                  const overallRating =
                    (review.ratingSalary + review.ratingOt + review.ratingHousing) /
                      3;

                  return (
                    <div
                      key={review.id}
                      className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4 hover:shadow-md transition duration-300 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-inner">
                            {review.workerRole.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1">
                              {review.workerRole}{" "}
                              {getCountryFlag(review.countryFrom)}
                            </h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                              {t("factoryDetail.reviewFrom").replace("{country}", review.countryFrom).replace("{date}", formatDate(review.createdAt))}
                            </p>
                          </div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 px-2.5 py-1 rounded-full flex items-center">
                          <StarRating rating={overallRating} size="sm" showValue />
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {review.reviewText}
                      </p>

                      <div className="flex gap-4 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-slate-700 pt-3 font-medium">
                        <span className="flex items-center gap-1">
                          💰 Salary:{" "}
                          <strong className="text-slate-600 dark:text-slate-300">
                            {review.ratingSalary}/5
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ OT:{" "}
                          <strong className="text-slate-600 dark:text-slate-300">
                            {review.ratingOt}/5
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          🏠 Housing:{" "}
                          <strong className="text-slate-600 dark:text-slate-300">
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
            {t("factoryDetail.backToAll")}
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

      <AlertModal
        isOpen={loginAlertOpen}
        onClose={(confirmed) => {
          setLoginAlertOpen(false);
          if (confirmed) router.push("/login");
        }}
        title={t("nav.login")}
        message={t("auth.loginRequired")}
        confirmLabel={t("nav.login")}
        cancelLabel="Cancel"
      />
    </div>
  );
}
