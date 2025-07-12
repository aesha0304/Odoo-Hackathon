import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Clock, ArrowLeft, MessageSquare } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

function getColorFromName(name) {
  const colors = [
    'bg-primary-500', 'bg-secondary-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500',
    'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const ProfileDetails = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      setError('User not found or profile is private');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-500 mb-6">{error || 'This profile is not available.'}</p>
          <Link
            to="/"
            className="btn-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Browse
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              {user.profilePhoto && !imgError ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-gray-200"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-200 text-white text-4xl font-bold ${getColorFromName(user.name)}`}>
                  {user.name && user.name.split(' ').length > 1
                    ? user.name.split(' ')[0][0] + user.name.split(' ')[1][0]
                    : user.name[0]}
                </div>
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
              
              <div className="flex items-center justify-center space-x-1 text-gray-500 mb-4">
                <MapPin size={16} />
                <span>{user.location}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center space-x-1 mb-4">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">{user.rating}</span>
                <span className="text-sm text-gray-500">({Math.floor(Math.random() * 50) + 10} reviews)</span>
              </div>

              {/* Availability */}
              {user.availability && (
                <div className="flex items-center justify-center space-x-1 text-gray-600 mb-6">
                  <Clock size={16} />
                  <span className="text-sm">{user.availability}</span>
                </div>
              )}

              {/* Request Button */}
              {currentUser && currentUser.id !== user.id ? (
                <Link
                  to={`/request/${user.id}`}
                  className="w-full btn-primary py-3 text-base font-medium"
                >
                  Request Skill Swap
                </Link>
              ) : !currentUser ? (
                <Link
                  to="/login"
                  className="w-full btn-primary py-3 text-base font-medium"
                >
                  Login to Request
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Offered */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Can Teach</h2>
            {user.skillsOffered && user.skillsOffered.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills offered yet</p>
            )}
          </div>

          {/* Skills Wanted */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Want to Learn</h2>
            {user.skillsWanted && user.skillsWanted.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted.map((skill, index) => (
                  <span key={index} className="skill-tag-wanted">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills wanted yet</p>
            )}
          </div>

          {/* About Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">
              {user.name} is passionate about sharing knowledge and learning new skills. 
              They're excited to connect with others in the community and engage in meaningful skill exchanges.
              {user.availability && ` They're typically available ${user.availability.toLowerCase()}.`}
            </p>
          </div>

          {/* Recent Activity (Placeholder) */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Completed a skill swap for Web Development</span>
                <span className="text-gray-400">2 days ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Started learning Photography</span>
                <span className="text-gray-400">1 week ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Joined the Skill Swap community</span>
                <span className="text-gray-400">3 weeks ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails; 