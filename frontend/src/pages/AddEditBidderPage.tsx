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
    // Requirements removed as per user request
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

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex-shrink-0 flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/bidders')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <p className="text-slate-500">
            {isEdit ? `Editing supplier ${formData.name || 'details'}` : 'Register a new supplier in the system'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <form id="bidderForm" onSubmit={handleSubmit} className="space-y-6 pb-24">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
            <div className="flex items-center gap-2 text-[#bd5d2a] mb-2">
              <div className="w-1.5 h-6 bg-[#bd5d2a] rounded-full" />
              <h3 className="font-bold text-lg">Supplier Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Company Name" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Enter company name" />
              <Input label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="supplier@example.com" />
              <Input label="Contact Number" name="contact" value={formData.contact || ''} onChange={handleChange} placeholder="+94 ..." />
            </div>
            
            <Textarea label="Office Address" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Enter full business address" rows={4} />
          </div>

          {/* Sticky Actions */}
          <div className="sticky bottom-0 z-30 mt-8 flex items-center justify-end gap-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-6 ring-1 ring-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/bidders')}>
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Save Supplier
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}