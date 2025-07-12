import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Edit2, Save, X, Plus, Trash2, MapPin, Clock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const SKILLS_LIST = [
  // Coding/Tech (20+)
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'TypeScript', 'React', 'Node.js', 'HTML', 'CSS',
  'SQL', 'MongoDB', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Django', 'Flask',
  'Angular', 'Vue.js', 'Next.js', 'Express.js', 'Spring Boot',
  // Other popular skills
  'UI/UX Design', 'Graphic Design', 'Photography', 'Video Editing', 'Public Speaking',
  'Project Management', 'Marketing', 'Copywriting', 'SEO', 'Sales',
  'Cooking', 'Baking', 'Yoga', 'Fitness Training', 'Spanish', 'French', 'German', 'Mandarin',
  'Music Theory', 'Guitar', 'Piano', 'Singing', 'Drawing', 'Painting', 'Chess', 'Data Analysis',
  'Machine Learning', 'Cloud Computing', 'DevOps', 'Cybersecurity', 'Blockchain', 'AI',
];

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

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || '',
    profile: user?.profile || 'public'
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [offeredOther, setOfferedOther] = useState('');
  const [wantedOther, setWantedOther] = useState('');
  const [offeredSelect, setOfferedSelect] = useState('');
  const [wantedSelect, setWantedSelect] = useState('');
  const [imgError, setImgError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addSkillOffered = () => {
    let skill = offeredSelect === 'Other' ? offeredOther.trim() : offeredSelect;
    if (skill && !formData.skillsOffered.includes(skill)) {
      setFormData({
        ...formData,
        skillsOffered: [...formData.skillsOffered, skill]
      });
      setOfferedOther('');
      setOfferedSelect('');
    }
  };

  const removeSkillOffered = (index) => {
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const addSkillWanted = () => {
    let skill = wantedSelect === 'Other' ? wantedOther.trim() : wantedSelect;
    if (skill && !formData.skillsWanted.includes(skill)) {
      setFormData({
        ...formData,
        skillsWanted: [...formData.skillsWanted, skill]
      });
      setWantedOther('');
      setWantedSelect('');
    }
  };

  const removeSkillWanted = (index) => {
    setFormData({
      ...formData,
      skillsWanted: formData.skillsWanted.filter((_, i) => i !== index)
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.put(`/api/users/${user.id}`, { ...formData, profilePhoto }, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'user-id': user.id
        }
      });
      updateUser(response.data);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      location: user?.location || '',
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
      availability: user?.availability || '',
      profile: user?.profile || 'public'
    });
    setIsEditing(false);
    setError('');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your profile and skills</p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              className="btn-outline flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Save size={16} />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Photo and Basic Info */}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field text-center text-xl font-semibold"
                  />
                ) : (
                  user.name
                )}
              </h2>
              
              <div className="flex items-center justify-center space-x-1 text-gray-500 mb-4">
                <MapPin size={16} />
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field text-center"
                    placeholder="Location"
                  />
                ) : (
                  <span>{user.location}</span>
                )}
              </div>

              {/* Profile Visibility */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Visibility
                </label>
                <select
                  name="profile"
                  value={formData.profile}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="input-field"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                {isEditing ? (
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select availability</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Evenings">Evenings</option>
                    <option value="Mornings">Mornings</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                ) : (
                  <div className="flex items-center justify-center space-x-1 text-gray-600">
                    <Clock size={16} />
                    <span>{user.availability || 'Not specified'}</span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  {profilePhoto && (
                    <img src={profilePhoto} alt="Preview" className="w-24 h-24 rounded-full mx-auto mt-2" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Offered */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Can Offer</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <select
                    value={offeredSelect}
                    onChange={e => setOfferedSelect(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a skill</option>
                    {SKILLS_LIST.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {offeredSelect === 'Other' && (
                    <input
                      type="text"
                      value={offeredOther}
                      onChange={e => setOfferedOther(e.target.value)}
                      className="input-field"
                      placeholder="Enter custom skill"
                    />
                  )}
                  <button type="button" onClick={addSkillOffered} className="btn-primary flex items-center">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillsOffered.map((skill, index) => (
                    <span key={index} className="skill-tag flex items-center">
                      {skill}
                      <button type="button" onClick={() => removeSkillOffered(index)} className="ml-1 text-red-500 hover:text-red-700">
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skillsOffered && user.skillsOffered.length > 0 ? (
                  user.skillsOffered.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Skills Wanted */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <select
                    value={wantedSelect}
                    onChange={e => setWantedSelect(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a skill</option>
                    {SKILLS_LIST.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {wantedSelect === 'Other' && (
                    <input
                      type="text"
                      value={wantedOther}
                      onChange={e => setWantedOther(e.target.value)}
                      className="input-field"
                      placeholder="Enter custom skill"
                    />
                  )}
                  <button type="button" onClick={addSkillWanted} className="btn-primary flex items-center">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillsWanted.map((skill, index) => (
                    <span key={index} className="skill-tag-wanted flex items-center">
                      {skill}
                      <button type="button" onClick={() => removeSkillWanted(index)} className="ml-1 text-red-500 hover:text-red-700">
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skillsWanted && user.skillsWanted.length > 0 ? (
                  user.skillsWanted.map((skill, index) => (
                    <span key={index} className="skill-tag-wanted">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills wanted yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 