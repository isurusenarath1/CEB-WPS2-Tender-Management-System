import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Bidder } from '../utils/types';
export function AddEditBidderPage() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState<Partial<Bidder>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
          const res = await fetch(`/api/bidders/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
          });
          const data = await res.json();
          setFormData({ ...data, id: data._id || data.id });
        } catch (err) {
          console.error('Failed to load supplier', err);
        }
      })();
    }
  }, [id, isEdit]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrors({
        name: 'Name is required',
        email: 'Email is required'
      });
      return;
    }
    (async () => {
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const payload = {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          address: formData.address
        };
        const url = isEdit ? `/api/bidders/${id}` : '/api/bidders';
        const method = isEdit ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Failed to save' }));
          alert(err.message || 'Failed to save supplier');
          return;
        }
        navigate('/bidders');
      } catch (err) {
        console.error(err);
        alert('Failed to save supplier');
      }
    })();
  };
  return <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/bidders')} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">
          {isEdit ? 'Edit Supplier' : 'Add New Supplier'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        <Input label="Company Name" name="name" value={formData.name || ''} onChange={handleChange} error={errors.name} />
        <Input label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleChange} error={errors.email} />
        <Input label="Contact Number" name="contact" value={formData.contact || ''} onChange={handleChange} />
        <Textarea label="Address" name="address" value={formData.address || ''} onChange={handleChange} />

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/bidders')}>
            Cancel
          </Button>
          <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Save Supplier
          </Button>
        </div>
      </form>
    </div>;
}