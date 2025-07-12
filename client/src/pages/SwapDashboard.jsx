import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const SwapDashboard = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSwaps();
    }
  }, [user]);

  const fetchSwaps = async () => {
    try {
      const response = await axios.get('/api/swaps', {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'user-id': user.id
        }
      });
      setSwaps(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching swaps:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (swapId, status) => {
    setUpdating(swapId);
    try {
      await axios.put(`/api/swaps/${swapId}`, { status }, {
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'user-id': user.id
        }
      });
      await fetchSwaps(); // Refresh the list
    } catch (error) {
      console.error('Error updating swap:', error);
    }
    setUpdating(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'accepted':
        return <Check size={16} />;
      case 'rejected':
        return <X size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const filteredSwaps = swaps.filter(swap => {
    if (activeTab === 'incoming') {
      return swap.toUserId === user?.id;
    } else if (activeTab === 'outgoing') {
      return swap.fromUserId === user?.id;
    } else {
      return swap.status === activeTab;
    }
  });

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
        <p className="text-gray-600">Manage your skill swap requests and responses</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8">
        <div className="flex space-x-1">
          {[
            { id: 'pending', label: 'Pending', count: swaps.filter(s => s.status === 'pending').length },
            { id: 'accepted', label: 'Accepted', count: swaps.filter(s => s.status === 'accepted').length },
            { id: 'rejected', label: 'Rejected', count: swaps.filter(s => s.status === 'rejected').length },
            { id: 'incoming', label: 'Incoming', count: swaps.filter(s => s.toUserId === user?.id).length },
            { id: 'outgoing', label: 'Outgoing', count: swaps.filter(s => s.fromUserId === user?.id).length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary-200' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Swaps List */}
      {filteredSwaps.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No swap requests found</h3>
          <p className="text-gray-500">
            {activeTab === 'pending' && 'No pending requests at the moment.'}
            {activeTab === 'accepted' && 'No accepted requests yet.'}
            {activeTab === 'rejected' && 'No rejected requests.'}
            {activeTab === 'incoming' && 'No incoming requests.'}
            {activeTab === 'outgoing' && 'No outgoing requests.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map((swap) => {
            const isIncoming = swap.toUserId === user?.id;
            const otherUser = isIncoming ? 
              { id: swap.fromUserId, name: 'User', profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' } : 
              { id: swap.toUserId, name: 'User', profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' };

            return (
              <div key={swap.id} className="card">
                <div className="flex items-start space-x-4">
                  {/* User Avatar */}
                  <img
                    src={otherUser.profilePhoto}
                    alt={otherUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* Swap Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isIncoming ? 'Incoming Request' : 'Outgoing Request'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {isIncoming ? 'From' : 'To'}: {otherUser.name}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(swap.status)}`}>
                        {getStatusIcon(swap.status)}
                        <span className="ml-1 capitalize">{swap.status}</span>
                      </span>
                    </div>

                    {/* Swap Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">You'll teach:</h4>
                        <span className="skill-tag">{swap.fromSkill}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">You'll learn:</h4>
                        <span className="skill-tag-wanted">{swap.toSkill}</span>
                      </div>
                    </div>

                    {/* Message */}
                    {swap.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">{swap.message}</p>
                      </div>
                    )}

                    {/* Date */}
                    <p className="text-xs text-gray-500">
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isIncoming && swap.status === 'pending' && (
                  <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleStatusUpdate(swap.id, 'rejected')}
                      disabled={updating === swap.id}
                      className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {updating === swap.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <X size={16} />
                          <span>Decline</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(swap.id, 'accepted')}
                      disabled={updating === swap.id}
                      className="btn-primary"
                    >
                      {updating === swap.id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Accept</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* View Profile Link */}
                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`/user/${otherUser.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Placeholder */}
      {filteredSwaps.length > 0 && (
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

export default SwapDashboard; 