import { useEffect, useState } from "react";
import { adminAPI } from "../services/api";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all'
  });

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [filters]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const queryParams = {};
      if (filters.status !== 'all') queryParams.status = filters.status;
      if (filters.priority !== 'all') queryParams.priority = filters.priority;

      const data = await adminAPI.getAllContacts(queryParams);
      setContacts(data.contacts || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getContactStats();
      setStats(data.stats || {});
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const updateContactStatus = async (contactId, status, priority, adminNotes) => {
    try {
      await adminAPI.updateContact(contactId, { status, priority, adminNotes });
      await fetchContacts();
      await fetchStats();
      setSelectedContact(null);
      alert('Contact updated successfully!');
    } catch (err) {
      alert('Error updating contact: ' + err.message);
    }
  };

  const deleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact inquiry?')) return;

    try {
      await adminAPI.deleteContact(contactId);
      await fetchContacts();
      await fetchStats();
      setSelectedContact(null);
      alert('Contact deleted successfully!');
    } catch (err) {
      alert('Error deleting contact: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Contact Inquiries</h1>
        <div className="text-sm text-gray-600">
          Total: {stats.total || 0} inquiries
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-gray-600">Total</h3>
          <p className="text-2xl font-bold text-blue-500">{stats.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-gray-600">Unread</h3>
          <p className="text-2xl font-bold text-red-500">{stats.unread || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-gray-600">Read</h3>
          <p className="text-2xl font-bold text-blue-500">{stats.read || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-gray-600">Replied</h3>
          <p className="text-2xl font-bold text-green-500">{stats.replied || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-semibold text-gray-600">Urgent</h3>
          <p className="text-2xl font-bold text-orange-500">{stats.urgent || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No contact inquiries found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div 
                className="p-4 sm:p-6 cursor-pointer"
                onClick={() => setSelectedContact(selectedContact === contact._id ? null : contact._id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Name</p>
                        <p className="font-semibold">{contact.firstName} {contact.lastName}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="font-medium">{contact.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="font-medium">{contact.phone || 'N/A'}</p>
                      </div>
                      
                      <div className="sm:text-right">
                        <p className="text-sm text-gray-600 mb-1">Date</p>
                        <p className="font-medium text-sm">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                    
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getPriorityColor(contact.priority)}`}>
                      {contact.priority}
                    </span>
                    
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg 
                        className={`w-5 h-5 transition-transform ${
                          selectedContact === contact._id ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Contact Details */}
              {selectedContact === contact._id && (
                <div className="border-t bg-gray-50 p-4 sm:p-6">
                  <div className="space-y-6">
                    {/* Message */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Message</h3>
                      <div className="bg-white p-4 rounded border">
                        <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Full Name:</span>
                            <span className="font-medium">{contact.firstName} {contact.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{contact.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">{contact.phone || 'Not provided'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Submitted:</span>
                            <span className="font-medium">
                              {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {contact.respondedAt && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Responded:</span>
                              <span className="font-medium">
                                {new Date(contact.respondedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          )}
                          {contact.respondedBy && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Responded By:</span>
                              <span className="font-medium">{contact.respondedBy.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Admin Notes */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Admin Notes</h3>
                        <textarea
                          defaultValue={contact.adminNotes}
                          placeholder="Add internal notes about this inquiry..."
                          className="w-full h-24 px-3 py-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
                          id={`notes-${contact._id}`}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t">
                      <select
                        defaultValue={contact.status}
                        onChange={(e) => {
                          const notes = document.getElementById(`notes-${contact._id}`).value;
                          updateContactStatus(contact._id, e.target.value, contact.priority, notes);
                        }}
                        className="px-4 py-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="unread">Mark as Unread</option>
                        <option value="read">Mark as Read</option>
                        <option value="replied">Mark as Replied</option>
                        <option value="archived">Archive</option>
                      </select>

                      <select
                        defaultValue={contact.priority}
                        onChange={(e) => {
                          const notes = document.getElementById(`notes-${contact._id}`).value;
                          updateContactStatus(contact._id, contact.status, e.target.value, notes);
                        }}
                        className="px-4 py-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>

                      <button
                        onClick={() => {
                          const notes = document.getElementById(`notes-${contact._id}`).value;
                          updateContactStatus(contact._id, contact.status, contact.priority, notes);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Save Notes
                      </button>

                      <a
                        href={`mailto:${contact.email}?subject=Re: Your inquiry to Empress PC&body=Hi ${contact.firstName},\n\nThank you for contacting Empress PC. `}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors inline-block text-center"
                      >
                        Reply via Email
                      </a>

                      <button
                        onClick={() => deleteContact(contact._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <button
                        onClick={() => updateContactStatus(contact._id, 'read', contact.priority, contact.adminNotes)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                      >
                        Mark as Read
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact._id, 'replied', contact.priority, contact.adminNotes)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                      >
                        Mark as Replied
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact._id, contact.status, 'urgent', contact.adminNotes)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                      >
                        Mark as Urgent
                      </button>
                      <button
                        onClick={() => updateContactStatus(contact._id, 'archived', contact.priority, contact.adminNotes)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}