import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import axios from 'axios';
import UserCard from '../components/UserCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, availabilityFilter]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.skillsWanted.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(user =>
        user.availability.toLowerCase().includes(availabilityFilter.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Skill Swap
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with people who have the skills you need and share your expertise in return.
          Build meaningful connections while learning something new.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Availability Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="all">All Availability</option>
              <option value="weekends">Weekends</option>
              <option value="weekdays">Weekdays</option>
              <option value="evenings">Evenings</option>
              <option value="mornings">Mornings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Available Users ({filteredUsers.length})
        </h2>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? "Try adjusting your search terms or filters."
              : "No users are currently available."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}

      {/* Pagination Placeholder */}
      {filteredUsers.length > 0 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">Page 1 of 1</span>
            <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 