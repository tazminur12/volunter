import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../shared/context/AuthProvider';
import { LoadingSpinner } from '../../shared/components';
import { useAxios } from '../../shared/hooks';
import { useVolunteerQueries } from './useVolunteerQueries';
import { usePostQueries } from '../posts/usePostQueries';

const BeVolunteer = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState("");
  
  // Use the new query hooks
  const { usePost } = usePostQueries();
  const { useApplyForVolunteer, useDecreaseVolunteerCount } = useVolunteerQueries();
  
  // Fetch post data
  const { data: post, isLoading: postLoading, error: postError } = usePost(id);
  
  // Mutation hooks
  const applyForVolunteerMutation = useApplyForVolunteer();
  const decreaseVolunteerCountMutation = useDecreaseVolunteerCount();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const volunteerData = {
      postId: post._id,
      thumbnail: post.thumbnail,
      title: post.title,
      description: post.description,
      category: post.category,
      location: post.location,
      volunteersNeeded: post.volunteersNeeded,
      deadline: post.deadline,
      organizerName: post.organizerName,
      organizerEmail: post.organizerEmail,
      volunteerName: user?.displayName,
      volunteerEmail: user?.email,
      suggestion,
      status: "pending"
    };

    try {
      // Apply for volunteer opportunity
      await applyForVolunteerMutation.mutateAsync(volunteerData);
      
      // Decrease volunteer count
      await decreaseVolunteerCountMutation.mutateAsync(post._id);
      
      navigate("/dashboard/my-volunteer-requests");
    } catch (err) {
      console.error(err);
      // Error handling is done in the mutation hooks
    }
  };

  if (postLoading) return <LoadingSpinner />;
  if (postError) return <p className="text-center text-red-500">Error loading post: {postError.message}</p>;
  if (!post) return <p className="text-center text-red-500">Post not found</p>;

  if (post.volunteersNeeded === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-xl font-medium text-red-500">
          No volunteers needed for this post.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Be a Volunteer for: {post.title}</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md dark:bg-gray-900"
      >
        {/* Read-only Post Info */}
        <input type="text" readOnly value={post.thumbnail} className="input input-bordered w-full" placeholder="Thumbnail URL" />
        <input type="text" readOnly value={post.title} className="input input-bordered w-full" placeholder="Post Title" />
        <input type="text" readOnly value={post.category} className="input input-bordered w-full" />
        <input type="text" readOnly value={post.location} className="input input-bordered w-full" />
        <input type="text" readOnly value={post.deadline?.slice(0, 10)} className="input input-bordered w-full" />
        <input type="text" readOnly value={post.organizerName} className="input input-bordered w-full" />
        <input type="text" readOnly value={post.organizerEmail} className="input input-bordered w-full" />
        <input type="text" readOnly value={`Needed: ${post.volunteersNeeded}`} className="input input-bordered w-full" />
        <textarea
          readOnly
          value={post.description}
          className="textarea textarea-bordered w-full sm:col-span-2"
          rows="3"
        />

        {/* Volunteer Info */}
        <input type="text" readOnly value={user?.displayName || ''} className="input input-bordered w-full" placeholder="Your Name" />
        <input type="email" readOnly value={user?.email || ''} className="input input-bordered w-full" placeholder="Your Email" />

        {/* Suggestion */}
        <textarea
          placeholder="Write a suggestion (optional)"
          className="textarea textarea-bordered w-full sm:col-span-2"
          rows="3"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        ></textarea>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary w-full sm:col-span-2"
          disabled={applyForVolunteerMutation.isPending || decreaseVolunteerCountMutation.isPending}
        >
          {applyForVolunteerMutation.isPending || decreaseVolunteerCountMutation.isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Submitting...
            </>
          ) : (
            'Request to Volunteer'
          )}
        </button>
      </form>
    </div>
  );
};

export default BeVolunteer;
