import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddPost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Healthcare',
    'Education',
    'Social Service',
    'Animal Welfare',
    'Environment',
    'Disaster Relief'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    
    const newPost = {
      title: form.title.value,
      description: form.description.value,
      thumbnail: form.thumbnail.value,
      category: selectedCategory,
      location: form.location.value,
      volunteersNeeded: parseInt(form.volunteersNeeded.value),
      deadline: deadline.toISOString(),
      organizerName: user?.displayName || 'Anonymous',
      organizerEmail: user?.email,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    try {
      const res = await fetch('https://volunteerhub-server.vercel.app/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(newPost),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Post created successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/manage-posts');
      } else {
        throw new Error(data.message || 'Failed to create post');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Volunteer Opportunity</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Thumbnail */}
        <div>
          <label className="block font-medium mb-1">Thumbnail URL</label>
          <input 
            type="url" 
            name="thumbnail" 
            placeholder="https://example.com/image.jpg"
            required 
            className="input input-bordered w-full" 
          />
        </div>

        {/* Post Title */}
        <div>
          <label className="block font-medium mb-1">Post Title*</label>
          <input 
            type="text" 
            name="title" 
            placeholder="Help needed for community clean-up"
            required 
            className="input input-bordered w-full" 
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description*</label>
          <textarea 
            name="description" 
            rows="5" 
            placeholder="Describe the volunteer opportunity in detail..."
            required 
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        {/* Category and Location */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Category*</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="select select-bordered w-full"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Location*</label>
            <input 
              type="text" 
              name="location" 
              placeholder="City, Country"
              required 
              className="input input-bordered w-full" 
            />
          </div>
        </div>

        {/* Volunteers Needed and Deadline */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Volunteers Needed*</label>
            <input 
              type="number" 
              name="volunteersNeeded" 
              min="1"
              placeholder="5"
              required 
              className="input input-bordered w-full" 
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Deadline*</label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              minDate={new Date()}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>

        {/* Organizer Info (read-only) */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">Organizer Name</label>
            <input 
              type="text" 
              value={user?.displayName || 'Anonymous'}
              readOnly
              className="input input-bordered w-full bg-gray-100" 
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium mb-1">Organizer Email</label>
            <input 
              type="email" 
              value={user?.email || 'Not provided'}
              readOnly
              className="input input-bordered w-full bg-gray-100" 
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn btn-primary w-full mt-6"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span>
              Creating Post...
            </>
          ) : (
            'Add Volunteer Opportunity'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddPost;