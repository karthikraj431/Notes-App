import React, { useState } from "react";
import { toast } from "react-toastify";

const FeedbackModal = ({ closeModal, submitFeedback }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    submitFeedback({ rating, comment });
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Leave a Feedback</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-1 text-2xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment"
            className="px-3 py-2 border rounded h-24"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
