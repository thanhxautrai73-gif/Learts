import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, deleteAdminUser } from '../../services/api';
import { Users, Trash2, UserPlus, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminUsers: React.FC = () => {
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: (data) => {
      toast.success(`Deleted admin user "${data.username}" successfully.`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    },
  });

  const handleDelete = (id: string, username: string) => {
    if (id === currentUser.id) {
      toast.error('You cannot delete your own logged-in account.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete admin "${username}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Failed to fetch admin users. Please make sure the backend server is running.
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Overview Stat Card */}
      <div className="row mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm rounded p-4 d-flex align-items-center justify-content-between" style={{ background: '#fff' }}>
            <div>
              <span className="text-muted text-uppercase font-weight-bold small">Total Admin Accounts</span>
              <h2 className="m-0 font-weight-bold mt-2 text-dark">{users.length}</h2>
            </div>
            <div className="p-3 bg-light rounded-circle text-primary">
              <Users size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Users List Card */}
      <div className="card border-0 shadow-sm rounded">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h5 className="m-0 font-weight-bold text-dark d-flex align-items-center" style={{ gap: '10px' }}>
            <Shield size={20} className="text-primary" />
            <span>Admin Users Directory</span>
          </h5>
          <a 
            href="/admin/register" 
            className="btn btn-primary d-flex align-items-center" 
            style={{ backgroundColor: 'var(--color-primary, #a88b67)', border: 'none', gap: '8px' }}
          >
            <UserPlus size={16} />
            <span>Add New Admin</span>
          </a>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-light text-uppercase small font-weight-bold">
                <tr>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Registration Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      No admin users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3 font-weight-bold">
                        {user.username}
                        {user._id === currentUser.id && (
                          <span className="badge badge-primary ml-2 px-2 py-1" style={{ backgroundColor: 'var(--color-primary, #a88b67)' }}>
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">{user.email}</td>
                      <td className="px-4 py-3 text-muted">
                        {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(user._id, user.username)}
                          disabled={user._id === currentUser.id}
                          className="btn btn-sm btn-outline-danger"
                          style={{ padding: '6px 12px' }}
                          title={user._id === currentUser.id ? 'You cannot delete yourself' : 'Delete Account'}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
