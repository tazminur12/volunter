import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthProvider';
import Spinner from '../components/Spinner'; // Assuming you have a Spinner component

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication and authorization
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch post by ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Post not found' : 'Failed to fetch post');
        }

        const data = await res.json();
        const postData = data.data || data;

        // Verify the post belongs to the current user
        if (postData.organizerEmail !== user?.email) {
          throw new Error('Unauthorized to edit this post');
        }

        setPost(postData);
      } catch (err) {
        setError(err.message);
        Swal.fire('Error', err.message, 'error');
        navigate('/manage-posts');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedPost = {
      title: form.title.value,
      thumbnail: form.thumbnail.value,
      description: form.description.value,
      category: form.category.value,
      location: form.location.value,
      volunteersNeeded: parseInt(form.volunteersNeeded.value),
      deadline: new Date(form.deadline.value).toISOString(),
      organizerName: user?.displayName,
      organizerEmail: user?.email,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedPost),
      });

      if (!res.ok) {
        throw new Error('Update failed');
      }

      Swal.fire('Updated!', 'Your post has been updated.', 'success');
      navigate('/manage-posts');
    } catch (err) {
      console.error('Update error:', err);
      Swal.fire('Error!', err.message || 'Something went wrong.', 'error');
    }
  };

  if (authLoading || loading) return <Spinner />;
  if (error) return <p className="text-red-500 text-center py-10">{error}</p>;
  if (!post) return <p className="text-red-500 text-center py-10">Post not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Update Volunteer Post</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          defaultValue={post.title}
          placeholder="Post Title"
          className="input input-bordered"
          required
          minLength="5"
        />
        <input
          type="url"
          name="thumbnail"
          defaultValue={post.thumbnail}
          placeholder="Thumbnail URL"
          className="input input-bordered"
          required
        />
        <textarea
          name="description"
          defaultValue={post.description}
          placeholder="Description"
          className="textarea textarea-bordered md:col-span-2"
          required
          minLength="20"
        />
        <select
          name="category"
          defaultValue={post.category}
          className="select select-bordered"
          required
        >
          <option disabled value="">Select Category</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="social service">Social Service</option>
          <option value="animal welfare">Animal Welfare</option>
        </select>
        <input
          type="text"
          name="location"
          defaultValue={post.location}
          placeholder="Location"
          className="input input-bordered"
          required
        />
        <input
          type="number"
          name="volunteersNeeded"
          defaultValue={post.volunteersNeeded}
          placeholder="Volunteers Needed"
          className="input input-bordered"
          required
          min="1"
        />
        <input
          type="date"
          name="deadline"
          defaultValue={post.deadline ? post.deadline.split('T')[0] : ''}
          className="input input-bordered"
          required
          min={new Date().toISOString().split('T')[0]}
        />

        {/* Organizer Info */}
        <input
          type="text"
          name="organizerName"
          value={user?.displayName || ''}
          readOnly
          className="input input-bordered"
        />
        <input
          type="email"
          name="organizerEmail"
          value={user?.email || ''}
          readOnly
          className="input input-bordered"
        />

        <button type="submit" className="btn btn-primary md:col-span-2">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;