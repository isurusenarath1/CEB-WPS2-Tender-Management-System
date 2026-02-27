import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Department } from '../utils/types';

export function AddEditDepartmentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<Partial<Department>>({
    status: 'Active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
          const res = await fetch(`/api/departments/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined
          });
          if (res.ok) {
            const data = await res.json();
            setFormData({ ...data, id: data._id || data.id });
          }
        } catch (err) {
          console.error('Failed to load department', err);
        }
      })();
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation removed as per user request
    (async () => {
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const url = isEdit ? `/api/departments/${id}` : '/api/departments';
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
          const err = await res.json().catch(() => ({ message: 'Failed to save department' }));
          setErrors({ submit: err.message || 'Failed to save department' });
          return;
        }
        navigate('/departments');
      } catch (err) {
        console.error(err);
        alert('Failed to save department');
      }
    })();
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex-shrink-0 flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/departments')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Department' : 'Add New Department'}
          </h2>
          <p className="text-slate-500">
            {isEdit ? `Editing ${formData.name || 'department details'}` : 'Create a new organizational department'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <form id="deptForm" onSubmit={handleSubmit} className="space-y-6 pb-24">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm mb-4">
                {errors.submit}
              </div>
            )}
            
            <div className="flex items-center gap-2 text-[#bd5d2a] mb-2">
              <div className="w-1.5 h-6 bg-[#bd5d2a] rounded-full" />
              <h3 className="font-bold text-lg">Department Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Department Name" name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. IT Department" />
              <Input label="Department Code" name="code" value={formData.code || ''} onChange={handleChange} placeholder="e.g. IT" />
            </div>

            <Textarea label="Description" name="description" value={formData.description || ''} onChange={handleChange} placeholder="Detailed description..." rows={3} />
            <Input label="Head of Department" name="headOfDepartment" value={formData.headOfDepartment || ''} onChange={handleChange} placeholder="e.g. Mr. John Doe" />

            <Select label="Status" name="status" value={formData.status || 'Active'} onChange={handleChange} options={[{
                value: 'Active',
                label: 'Active'
              }, {
                value: 'Inactive',
                label: 'Inactive'
              }]} />
          </div>

          {/* Sticky Actions */}
          <div className="sticky bottom-0 z-30 mt-8 flex items-center justify-end gap-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-6 ring-1 ring-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/departments')}>
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Save Department
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}