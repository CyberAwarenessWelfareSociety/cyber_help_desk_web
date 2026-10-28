import Header from "@/components/Home/Header";
import { useGetClassQuizStatsQuery } from "@/store/api/class-answer";
import { ArrowLeft, Award, BarChart3, Users } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } =
    useGetClassQuizStatsQuery(id, { skip: !id });

  const results = data?.results || [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft size={18} /> Back to class
          </button>

          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">
                Teacher and administrator access
              </p>
              <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Class quiz results
              </h1>
              <p className="mt-2 text-base text-slate-600">
                Review each learner&apos;s latest submitted quiz score.
              </p>
            </div>
            {!isLoading && !isError && (
              <button
                type="button"
                onClick={refetch}
                className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
              >
                Refresh results
              </button>
            )}
          </div>

          {isLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-lg text-slate-600 shadow-sm">
              Loading class results…
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-xl font-bold text-red-800">
                Results could not be loaded
              </p>
              <p className="mt-2 text-base text-red-700">
                {error?.data?.message || "Please try again in a moment."}
              </p>
              <button
                type="button"
                onClick={refetch}
                className="mt-5 rounded-lg bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <section className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <BarChart3 className="mb-4 text-indigo-600" size={28} />
                  <p className="text-base text-slate-600">Total questions</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">
                    {data?.totalQuestions || 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <Users className="mb-4 text-emerald-600" size={28} />
                  <p className="text-base text-slate-600">Learners attempted</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">
                    {data?.attemptedClients || 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <Award className="mb-4 text-amber-600" size={28} />
                  <p className="text-base text-slate-600">Highest score</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">
                    {results[0]?.score || "—"}
                  </p>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    Learner scores
                  </h2>
                </div>

                {results.length === 0 ? (
                  <div className="px-6 py-12 text-center text-base text-slate-600">
                    No learners have submitted this quiz yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">#</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Learner</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Email</th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Correct</th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {results.map((result, index) => (
                          <tr key={result.client?.id || index} className="hover:bg-slate-50">
                            <td className="whitespace-nowrap px-6 py-4 text-base text-slate-500">{index + 1}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-base font-semibold text-slate-900">
                              {result.client?.name || "Unknown learner"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-base text-slate-600">
                              {result.client?.email || "—"}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-center text-base text-slate-700">
                              {result.correct} / {result.totalQuestions}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-center">
                              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-base font-bold text-emerald-800">
                                {result.score}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminResults;
