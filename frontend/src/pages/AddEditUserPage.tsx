import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { mockSystemUsers } from '../utils/mockData';
import { SystemUser } from '../utils/types';
export function AddEditUserPage() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState<Partial<SystemUser & {
    password?: string;
  }>>({
    status: 'Active',
    role: 'Clerk 1'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('mock-auth-token');
        const res = await fetch(`/api/users/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        const normalized = {
          ...data,
          id: data._id || data.id
        };
        setFormData(normalized);
        return;
      } catch (err) {
        console.error('Failed to load user', err);
        const user = mockSystemUsers.find(u => u.id === id);
        if (user) setFormData(user);
      }
    };
    load();
  }, [id, isEdit]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {
          ...prev
        };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!isEdit && !formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      (async () => {
        try {
          const token = localStorage.getItem('authToken') || localStorage.getItem('mock-auth-token');
          const url = isEdit ? `/api/users/${id}` : '/api/users';
          const method = isEdit ? 'PUT' : 'POST';
          const body = { ...formData } as any;
          // do not send undefined fields
          Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
          const res = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Failed to save user' }));
            alert(err.message || 'Failed to save user');
            return;
          }
          navigate('/users');
        } catch (err) {
          console.error(err);
          alert('Failed to save user');
        }
      })();
    }
  };
  return <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/users')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit User' : 'Add New User'}
          </h2>
          <p className="text-slate-500">
            {isEdit ? `Editing ${formData.name}` : 'Create a new system user'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="space-y-6">
          <Input label="Full Name" name="name" value={formData.name || ''} onChange={handleChange} error={errors.name} placeholder="e.g. John Doe" />

          <Input label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleChange} error={errors.email} placeholder="e.g. john.doe@tec.gov" />

          <Select label="Role" name="role" value={formData.role || 'Clerk 1'} onChange={handleChange} error={errors.role} options={[{
          value: 'Super Admin',
          label: 'Super Admin'
        }, {
          value: 'Admin',
          label: 'Admin'
        }, {
          value: 'Clerk 1',
          label: 'Clerk 1'
        }, {
          value: 'Clerk 2',
          label: 'Clerk 2'
        }, {
          value: 'Clerk 3',
          label: 'Clerk 3'
        }]} />

          {!isEdit && <Input label="Password" name="password" type="password" value={formData.password || ''} onChange={handleChange} error={errors.password} placeholder="Enter password" />}

          <Select label="Status" name="status" value={formData.status || 'Active'} onChange={handleChange} options={[{
          value: 'Active',
          label: 'Active'
        }, {
          value: 'Inactive',
          label: 'Inactive'
        }]} />
        </div>

        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={() => navigate('/users')}>
            Cancel
          </Button>
          <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Save User
          </Button>
        </div>
      </form>
    </div>;
}