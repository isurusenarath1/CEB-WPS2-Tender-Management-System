import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { mockDepartments } from '../utils/mockData';
import { Department } from '../utils/types';
export function AddEditDepartmentPage() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState<Partial<Department>>({
    status: 'Active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (isEdit) {
      const department = mockDepartments.find(d => d.id === id);
      if (department) {
        setFormData(department);
      }
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
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Department name is required';
    if (!formData.code) newErrors.code = 'Department code is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.headOfDepartment) newErrors.headOfDepartment = 'Head of Department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // In a real app, API call here
      console.log('Saving department:', formData);
      navigate('/departments');
    }
  };
  return <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/departments')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Department' : 'Add New Department'}
          </h2>
          <p className="text-slate-500">
            {isEdit ? `Editing ${formData.name}` : 'Create a new organizational department'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Department Name" name="name" value={formData.name || ''} onChange={handleChange} error={errors.name} placeholder="e.g. IT Department" />

            <Input label="Department Code" name="code" value={formData.code || ''} onChange={handleChange} error={errors.code} placeholder="e.g. IT" />
          </div>

          <Textarea label="Description" name="description" value={formData.description || ''} onChange={handleChange} error={errors.description} placeholder="Detailed description of this department..." rows={3} />

          <Input label="Head of Department" name="headOfDepartment" value={formData.headOfDepartment || ''} onChange={handleChange} error={errors.headOfDepartment} placeholder="e.g. Mr. John Doe" />

          <Select label="Status" name="status" value={formData.status || 'Active'} onChange={handleChange} options={[{
          value: 'Active',
          label: 'Active'
        }, {
          value: 'Inactive',
          label: 'Inactive'
        }]} />
        </div>

        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={() => navigate('/departments')}>
            Cancel
          </Button>
          <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Save Department
          </Button>
        </div>
      </form>
    </div>;
}