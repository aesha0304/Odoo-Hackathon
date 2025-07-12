import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { useState } from 'react';

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

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [imgError, setImgError] = useState(false);

  const handleRequestClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      // Redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300">
      <div className="flex items-start space-x-4">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          {user.profilePhoto && !imgError ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors duration-200"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-200 group-hover:border-primary-300 transition-colors duration-200 ${getColorFromName(user.name)}`}>
              {user.name && user.name.split(' ').length > 1
                ? user.name.split(' ')[0][0] + user.name.split(' ')[1][0]
                : user.name[0]}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {user.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin size={14} />
                <span>{user.location}</span>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{user.rating}</span>
            </div>
          </div>

          {/* Availability */}
          {user.availability && (
            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
              <Clock size={14} />
              <span>{user.availability}</span>
            </div>
          )}

          {/* Skills */}
          <div className="space-y-2">
            {/* Skills Offered */}
            {user.skillsOffered && user.skillsOffered.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Skills Offered
                </h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag text-xs">
                      {skill}
                    </span>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{user.skillsOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Skills Wanted */}
            {user.skillsWanted && user.skillsWanted.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Skills Wanted
                </h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag-wanted text-xs">
                      {skill}
                    </span>
                  ))}
                  {user.skillsWanted.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{user.skillsWanted.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <Link
          to={`/user/${user.id}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 transition-colors duration-200"
        >
          <span>View Profile</span>
          <ArrowRight size={14} />
        </Link>
        
        <Link
          to={currentUser ? `/request/${user.id}` : '/login'}
          onClick={handleRequestClick}
          className={cn(
            "btn-primary text-sm px-4 py-2",
            !currentUser && "opacity-75 hover:opacity-100"
          )}
        >
          Request
        </Link>
      </div>
    </div>
  );
};

export default UserCard; 