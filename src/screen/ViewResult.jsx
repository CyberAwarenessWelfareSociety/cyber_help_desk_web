import Header from "@/components/Home/Header";
import { useGetClassResultQuery } from "@/store/api/class-answer";
import { selectCurrentUser } from "@/store/reducer/auth";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ViewResult = () => {
  const { id } = useParams(); // classId
  const currentUser = useSelector(selectCurrentUser);
  const client_id = currentUser?.id || null;

  const {
    data: resultResponse,
    isLoading,
    isError,
    error,
  } = useGetClassResultQuery(
    { clientId: client_id, classId: id },
    { skip: !client_id || !id },
  );

  const result = resultResponse?.data;

  if (!client_id || !id) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600">
        <p className="text-lg">Please log in to view your quiz results.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg text-gray-600 animate-pulse">
          Loading your results...
        </div>
      </div>
    );
  }

  if (isError || !result) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600">
        <div className="text-center max-w-md">
          <p className="text-xl font-medium">Failed to load results</p>
          <p className="mt-3 text-sm">
            {error?.data?.message ||
              "You may not have attempted this quiz yet."}
          </p>
        </div>
      </div>
    );
  }

  const { summary, questions } = result;

  return (
    <>
      <Header />
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto mt-15">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
          Quiz Results
        </h1>

        {/* Summary Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-3xl font-bold text-indigo-700 mt-1">
                {summary.totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Attempted</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {summary.attempted}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Correct</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {summary.correctAnswers}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-3xl font-bold text-indigo-600 mt-1">
                {Number(summary.percentage).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-lg font-medium">
              {summary.percentage >= 70
                ? "Great job! 🎉"
                : summary.percentage >= 40
                  ? "Good effort — keep practicing!"
                  : "Don't worry — try again!"}
            </p>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {questions.map((q, index) => {
            const isCorrect = !!q.isCorrect;
            const selectedKey = q.selectedOption; // option_a...
            const selectedValue = selectedKey ? q.options?.[selectedKey] : null;

            const correctKey = q.correctOptionKey; // option_b...
            const correctValue =
              q.correctOptionValue ||
              (correctKey ? q.options?.[correctKey] : null);

            return (
              <div
                key={q.questionId}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                        {q.question}
                      </h2>

                      {/* ✅ attempt meta */}
                      {q.attempt_no && (
                        <p className="text-xs text-gray-500 mt-1">
                          Attempt #{q.attempt_no}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div
                    className={`
                    p-5 rounded-lg border
                    ${
                      isCorrect
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                    }
                  `}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0
                        ${
                          isCorrect
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }
                      `}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </div>

                      <div className="flex-1">
                        {/* ✅ Your Answer */}
                        <p className="font-medium text-gray-800">
                          Your answer:{" "}
                          <span className="capitalize">
                            {selectedKey
                              ? selectedKey.replace("option_", "")
                              : "—"}
                          </span>
                          {" → "}
                          <span className="font-semibold">
                            {selectedValue || "—"}
                          </span>
                        </p>

                        {/* ✅ Correct Answer (show always OR only if wrong) */}
                        {!isCorrect && (
                          <p className="mt-3 text-sm text-gray-700">
                            Correct answer:{" "}
                            <span className="capitalize font-medium">
                              {correctKey
                                ? correctKey.replace("option_", "")
                                : "—"}
                            </span>
                            {" → "}
                            <span className="font-semibold">
                              {correctValue || "—"}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ✅ Optional: show all options (nice for review) */}
                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
                    {Object.entries(q.options || {}).map(([key, value]) => {
                      const isUser = key === selectedKey;
                      const isRight = key === correctKey;

                      return (
                        <div
                          key={key}
                          className={`px-4 py-3 rounded-lg border text-sm
                          ${
                            isRight
                              ? "border-green-400 bg-green-50"
                              : isUser && !isRight
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 bg-white"
                          }`}
                        >
                          <span className="font-semibold uppercase mr-2">
                            {key.replace("option_", "")}.
                          </span>
                          <span>{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ViewResult;
