import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DatePicker } from '../components/ui/DatePicker';
import { BidOpeningCommittee } from '../utils/types';
export function AddEditCommitteePage() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState<Partial<BidOpeningCommittee>>({
    status: 'Active',
    additionalMembers: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newMember, setNewMember] = useState('');
  const [staffList, setStaffList] = useState<{ name: string; id: string }[]>([]);
  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      try {
        const token = localStorage.getItem('mock-auth-token') || localStorage.getItem('authToken') || localStorage.getItem('token');
        const res = await fetch(`/api/committees/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const normalized = {
          ...data,
          id: data._id || data.id,
          appointedDate: data.appointedDate ? String(data.appointedDate).slice(0, 10) : ''
        };
        setFormData(normalized);
      } catch (err) {
        console.error('Failed to load committee from API', err);
      }
    };
    load();
  }, [id, isEdit]);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('mock-auth-token') || localStorage.getItem('token');
        const res = await fetch('/api/staff', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (!res.ok) throw new Error('Failed to fetch staff');
        const data = await res.json();
        const mapped = Array.isArray(data) ? data.map((s: any) => ({ id: s._id || s.id, name: s.name })) : [];
        setStaffList(mapped);
      } catch (err) {
        console.error('Failed to load staff list', err);
      }
    };
    loadStaff();
  }, []);
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
  const handleAddMember = () => {
    if (newMember && !formData.additionalMembers?.includes(newMember)) {
      setFormData(prev => ({
        ...prev,
        additionalMembers: [...(prev.additionalMembers || []), newMember]
      }));
      setNewMember('');
    }
  };
  const handleRemoveMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      additionalMembers: prev.additionalMembers?.filter(m => m !== member) || []
    }));
  };
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.committeeNumber) newErrors.committeeNumber = 'Committee Number is required';
    if (!formData.member1) newErrors.member1 = 'Member 1 is required';
    if (!formData.member2) newErrors.member2 = 'Member 2 is required';
    if (!formData.member3) newErrors.member3 = 'Member 3 is required';
    if (!formData.appointedDate) newErrors.appointedDate = 'Appointed Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      (async () => {
        try {
          const token = localStorage.getItem('mock-auth-token') || localStorage.getItem('authToken') || localStorage.getItem('token');
          const url = isEdit ? `/api/committees/${id}` : '/api/committees';
          const method = isEdit ? 'PUT' : 'POST';
          const res = await fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(formData)
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Failed to save' }));
            alert(err.message || 'Failed to save committee');
            return;
          }
          navigate('/bid-opening');
        } catch (err) {
          console.error(err);
          alert('Failed to save committee');
        }
      })();
    }
  };
  const staffOptions = staffList.map(s => ({ value: s.name, label: s.name }));
  return <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/bid-opening')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Committee' : 'Add New Committee'}
          </h2>
          <p className="text-slate-500">
            {isEdit ? `Editing ${formData.committeeNumber}` : 'Create a new bid opening committee'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Committee Number" name="committeeNumber" value={formData.committeeNumber || ''} onChange={handleChange} error={errors.committeeNumber} placeholder="e.g. BOC-2023-001" />

            <DatePicker label="Appointed Date" name="appointedDate" value={formData.appointedDate || ''} onChange={handleChange} error={errors.appointedDate} />
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Committee Members
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select label="Member 1" name="member1" value={formData.member1 || ''} onChange={handleChange} error={errors.member1} options={staffOptions} />

              <Select label="Member 2" name="member2" value={formData.member2 || ''} onChange={handleChange} error={errors.member2} options={staffOptions} />

              <Select label="Member 3" name="member3" value={formData.member3 || ''} onChange={handleChange} error={errors.member3} options={staffOptions} />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Additional Members (Optional)
            </h3>

            <div className="flex gap-2 mb-4">
              <select className="flex-1 h-10 rounded-md border border-slate-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" value={newMember} onChange={e => setNewMember(e.target.value)}>
                <option value="">Select a member to add</option>
                {staffOptions.map(option => <option key={option.value} value={option.value}>
                    {option.label}
                  </option>)}
              </select>
              <Button type="button" onClick={handleAddMember} disabled={!newMember} leftIcon={<Plus className="w-4 h-4" />}>
                Add
              </Button>
            </div>

            {formData.additionalMembers && formData.additionalMembers.length > 0 && <div className="space-y-2">
                  {formData.additionalMembers.map((member, index) => <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm text-slate-700">{member}</span>
                      <button type="button" onClick={() => handleRemoveMember(member)} className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>)}
                </div>}
          </div>

          <Select label="Status" name="status" value={formData.status || 'Active'} onChange={handleChange} options={[{
          value: 'Active',
          label: 'Active'
        }, {
          value: 'Inactive',
          label: 'Inactive'
        }]} />
        </div>

        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={() => navigate('/bid-opening')}>
            Cancel
          </Button>
          <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Save Committee
          </Button>
        </div>
      </form>
    </div>;
}