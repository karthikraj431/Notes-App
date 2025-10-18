import React, { useState } from "react";

const FeedbackModal = ({ closeModal, submitFeedback }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    submitFeedback(rating, comment);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Leave Feedback</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-1 text-yellow-400 text-2xl justify-center">
            {[1,2,3,4,5].map((i) => (
              <span key={i} onClick={() => setRating(i)} className={`cursor-pointer ${i <= rating ? "" : "text-gray-300"}`}>★</span>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your comments"
            className="px-3 py-2 border rounded h-24"
            required
          />
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-yellow-400 text-white">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
