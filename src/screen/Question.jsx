import Header from '@/components/Home/Header';
import { useSubmitAnswerMutation } from '@/store/api/class-answer';
import { useGetQuestionsByClassQuery } from '@/store/api/class-question'; // adjust path if needed
import { selectCurrentUser } from '@/store/reducer/auth';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Question = () => {
  const { id } = useParams(); // class id
  const { data: response, isLoading, isError, error } = useGetQuestionsByClassQuery(id);
  const [submitAnswers, { isLoading: isSubmitting, isSuccess, isError: submitError }] = useSubmitAnswerMutation();

  const questions = response?.data || [];

  // Store selected options: { questionId: selectedOptionKey } e.g. { "uuid1": "option_b" }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const currentUser = useSelector(selectCurrentUser);

  const client_id = currentUser ? currentUser.id : null;
  console.log("Client ID:", client_id);
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg text-gray-600 animate-pulse">Loading quiz...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600">
        <div className="text-center max-w-md">
          <p className="text-xl font-medium">Failed to load questions</p>
          <p className="mt-3 text-sm">
            {error?.data?.message || 'Something went wrong. Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        <p className="text-lg">No questions available for this class yet.</p>
      </div>
    );
  }

  const handleOptionChange = (questionId, optionKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    // Prepare payload matching backend expectation
    const payload = {
      client_id: client_id,
      answers: questions.map((q) => ({
        class_question_id: q.id,
        selected_option: selectedAnswers[q.id], // "option_a", "option_b", etc.
      })),
    };

    try {
      await submitAnswers(payload).unwrap();
      alert("Quiz submitted successfully!");
      // Optional: reset form, redirect, show score, etc.
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit answers. Please try again.");
    }
  };

  return (
    <>
      <Header />
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto mt-25">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
        Class Quiz ({questions.length} Questions)
      </h1>

      <div className="space-y-10">
        {questions.map((q, index) => {
          const options = [
            { key: 'option_a', label: 'A', text: q.option_a },
            { key: 'option_b', label: 'B', text: q.option_b },
            { key: 'option_c', label: 'C', text: q.option_c },
            { key: 'option_d', label: 'D', text: q.option_d },
          ];

          const selected = selectedAnswers[q.id];

          return (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
                    {q.question}
                  </h2>
                </div>
              </div>

              <div className="px-6 py-6 space-y-4">
                {options.map((opt) => (
                  <label
                    key={opt.key}
                    className={`
                      flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors
                      ${selected === opt.key
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      checked={selected === opt.key}
                      onChange={() => handleOptionChange(q.id, opt.key)}
                      className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-700 mr-3">{opt.label}.</span>
                      <span className="text-gray-800">{opt.text}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Section */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`
            px-10 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
            text-lg
          `}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </button>

        {isSuccess && (
          <p className="text-green-600 font-medium">Quiz submitted successfully!</p>
        )}
        {submitError && (
          <p className="text-red-600">
            Submission failed. Please try again.
          </p>
        )}
      </div>
    </div>
    </>
  );
};

export default Question;