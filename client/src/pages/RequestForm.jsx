import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, User } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const RequestForm = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fromSkill: '',
    toSkill: '',
    message: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchTargetUser();
  }, [userId, currentUser]);

  const fetchTargetUser = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setTargetUser(response.data);
      setLoading(false);
    } catch (error) {
      setError('User not found');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fromSkill || !formData.toSkill) {
      setError('Please select both skills for the swap');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/swaps', {
        toUserId: parseInt(userId),
        fromSkill: formData.fromSkill,
        toSkill: formData.toSkill,
        message: formData.message
      }, {
        headers: {
          'Authorization': `Bearer ${currentUser.id}`,
          'user-id': currentUser.id
        }
      });
      
      navigate('/swaps');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send request');
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/user/${userId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Profile
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Skill Swap Request</h1>
        <p className="text-gray-600">Propose a skill exchange with {targetUser.name}</p>
      </div>

      {/* Target User Info */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={targetUser.profilePhoto}
            alt={targetUser.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{targetUser.name}</h2>
            <p className="text-gray-600">{targetUser.location}</p>
          </div>
        </div>
      </div>

      {/* Request Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Skill Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I can teach you:
              </label>
              <select
                name="fromSkill"
                value={formData.fromSkill}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a skill you can teach</option>
                {currentUser.skillsOffered && currentUser.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {currentUser.skillsOffered && currentUser.skillsOffered.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  You haven't added any skills yet. 
                  <Link to="/profile" className="text-primary-600 hover:text-primary-700 ml-1">
                    Add skills to your profile
                  </Link>
                </p>
              )}
            </div>

            {/* Their Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to learn:
              </label>
              <select
                name="toSkill"
                value={formData.toSkill}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select a skill you want to learn</option>
                {targetUser.skillsOffered && targetUser.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {targetUser.skillsOffered && targetUser.skillsOffered.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {targetUser.name} hasn't added any skills yet.
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Introduce yourself and explain why you'd like to swap skills..."
            />
            <p className="text-sm text-gray-500 mt-1">
              A friendly message can help increase your chances of getting accepted!
            </p>
          </div>

          {/* Preview */}
          {formData.fromSkill && formData.toSkill && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Request Preview:</h3>
              <div className="text-sm text-gray-600">
                <p>You'll teach: <span className="skill-tag text-xs">{formData.fromSkill}</span></p>
                <p>You'll learn: <span className="skill-tag-wanted text-xs">{formData.toSkill}</span></p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3">
            <Link
              to={`/user/${userId}`}
              className="btn-outline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || !formData.fromSkill || !formData.toSkill}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for a successful request:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about what you can teach and what you want to learn</li>
          <li>• Include a friendly message explaining your interest</li>
          <li>• Make sure your profile is complete with your skills</li>
          <li>• Be patient - users may take time to respond</li>
        </ul>
      </div>
    </div>
  );
};

export default RequestForm; 