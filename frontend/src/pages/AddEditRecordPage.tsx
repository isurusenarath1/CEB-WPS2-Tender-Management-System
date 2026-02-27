import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { DatePicker } from '../components/ui/DatePicker';
import { Record as TmsRecord, Department, CategoryItem, Staff, Bidder, BidOpeningCommittee } from '../utils/types';

export function AddEditRecordPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<Partial<TmsRecord>>({
    status: 'Under Evaluation'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Data for dropdowns
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [committees, setCommitCommittees] = useState<BidOpeningCommittee[]>([]);

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const h = { headers: token ? { Authorization: `Bearer ${token}` } : undefined };
        
        const [depRes, catRes, staffRes, bidderRes, committeeRes] = await Promise.all([
          fetch('/api/departments', h),
          fetch('/api/categories', h),
          fetch('/api/staff', h),
          fetch('/api/bidders', h),
          fetch('/api/committees', h)
        ]);

        if (depRes.ok) setDepartments(await depRes.json());
        if (catRes.ok) setCategories(await catRes.json());
        if (staffRes.ok) setStaff(await staffRes.json());
        if (bidderRes.ok) setBidders(await bidderRes.json());
        if (committeeRes.ok) setCommitCommittees(await committeeRes.json());
      } catch (err) {
        console.error('Failed to load dropdown data', err);
      }
    };

    const loadRecord = async () => {
      if (!isEdit) return;
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const res = await fetch(`/api/records/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            ...data,
            id: data._id || data.id,
            bidStartDate: data.bidStartDate ? String(data.bidStartDate).slice(0, 10) : '',
            bidOpenDate: data.bidOpenDate ? String(data.bidOpenDate).slice(0, 10) : '',
            bidClosingDate: data.bidClosingDate ? String(data.bidClosingDate).slice(0, 10) : '',
            approvedDate: data.approvedDate ? String(data.approvedDate).slice(0, 10) : '',
            fileSentToTecDate: data.fileSentToTecDate ? String(data.fileSentToTecDate).slice(0, 10) : '',
            fileSentToTecSecondTime: data.fileSentToTecSecondTime ? String(data.fileSentToTecSecondTime).slice(0, 10) : '',
            bidValidityPeriod: data.bidValidityPeriod ? String(data.bidValidityPeriod).slice(0, 10) : '',
            serviceAgreementStartDate: data.serviceAgreementStartDate ? String(data.serviceAgreementStartDate).slice(0, 10) : '',
            serviceAgreementEndDate: data.serviceAgreementEndDate ? String(data.serviceAgreementEndDate).slice(0, 10) : ''
          });
        }
      } catch (err) {
        console.error('Failed to load record', err);
      }
    };

    loadDropdownData();
    loadRecord();
  }, [id, isEdit]);

  const handleCommitteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const committeeNumber = e.target.value;
    const committee = committees.find(c => c.committeeNumber === committeeNumber);
    
    setFormData(prev => ({
      ...prev,
      tecCommitteeNumber: committeeNumber,
      tecChairman: committee?.member1 || '',
      tecMember1: committee?.member2 || '',
      tecMember2: committee?.member3 || ''
    }));

    if (errors.tecCommitteeNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.tecCommitteeNumber;
        return newErrors;
      });
    }
  };

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
    if (!formData.tenderNumber) newErrors.tenderNumber = 'Tender Number is required';
    if (!formData.relevantTo) newErrors.relevantTo = 'Department is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.bidStartDate) newErrors.bidStartDate = 'Bid Start Date is required';
    if (!formData.bidOpenDate) newErrors.bidOpenDate = 'Bid Open Date is required';
    if (!formData.bidClosingDate) newErrors.bidClosingDate = 'Bid Closing Date is required';
    if (!formData.fileSentToTecDate) newErrors.fileSentToTecDate = 'File Sent to TEC Date is required';
    if (!formData.tecCommitteeNumber) newErrors.tecCommitteeNumber = 'TEC Committee Number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      (async () => {
        try {
          const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
          const url = isEdit ? `/api/records/${id}` : '/api/records';
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
            alert(err.message || 'Failed to save record');
            return;
          }
          navigate('/records');
        } catch (err) {
          console.error(err);
          alert('Failed to save record');
        }
      })();
    }
  };

  // Prepare dropdown options
  const departmentOptions = departments?.filter(d => d.status === 'Active').map(d => ({
    value: d.name,
    label: d.name
  })) || [];
  
  const categoryOptions = categories?.filter(c => c.status === 'Active').map(c => ({
    value: c.name,
    label: c.name
  })) || [];
  
  const staffOptions = staff?.map(s => ({
    value: s.name,
    label: s.name
  })) || [];
  
  const bidderOptions = bidders?.map(b => ({
    value: b.name,
    label: b.name
  })) || [];

  const committeeOptions = committees?.filter(c => c.status === 'Active').map(c => ({
    value: c.committeeNumber,
    label: c.committeeNumber
  })) || [];

  const remarkOptions = [{
    value: 'Awarded',
    label: 'Awarded'
  }, {
    value: 'Cancel',
    label: 'Cancel'
  }, {
    value: 'In PPC',
    label: 'In PPC'
  }, {
    value: 'Re-evaluation',
    label: 'Re-evaluation'
  }, {
    value: 'Retender',
    label: 'Retender'
  }, {
    value: 'Under Evaluation',
    label: 'Under Evaluation'
  }];

  const statusOptions = [{
    value: 'Awarded',
    label: 'Awarded'
  }, {
    value: 'Cancel',
    label: 'Cancel'
  }, {
    value: 'Close',
    label: 'Close'
  }, {
    value: 'Doc Review',
    label: 'Doc Review'
  }, {
    value: 'Negotiate or Clarification',
    label: 'Negotiate or Clarification'
  }, {
    value: 'Re-evaluation',
    label: 'Re-evaluation'
  }, {
    value: 'Reject',
    label: 'Reject'
  }, {
    value: 'Retender',
    label: 'Retender'
  }, {
    value: 'Under Evaluation',
    label: 'Under Evaluation'
  }];

  return <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex-shrink-0 flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/records')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isEdit ? 'Edit Record' : 'Add New Record'}
          </h2>
          <p className="text-slate-500">
            {isEdit ? `Editing tender ${formData.tenderNumber}` : 'Create a new tender record'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <form id="recordForm" onSubmit={handleSubmit} className="space-y-6 pb-24">
          {/* Tender Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Tender Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Tender Number" name="tenderNumber" value={formData.tenderNumber || ''} onChange={handleChange} error={errors.tenderNumber} placeholder="e.g. TEC-2023-001" />

              <Select label="Relevant To (Department)" name="relevantTo" value={formData.relevantTo || ''} onChange={handleChange} error={errors.relevantTo} options={departmentOptions} />

              <Select label="Category" name="category" value={formData.category || ''} onChange={handleChange} error={errors.category} options={categoryOptions} />

              <Select label="Other" name="other" value={formData.other || ''} onChange={handleChange} options={staffOptions} />

              <div className="md:col-span-2">
                <Textarea label="Description" name="description" value={formData.description || ''} onChange={handleChange} error={errors.description} placeholder="Detailed description of the tender..." rows={4} />
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DatePicker label="Bid Start Date" name="bidStartDate" value={formData.bidStartDate || ''} onChange={handleChange} error={errors.bidStartDate} />

              <DatePicker label="Tender Open Date" name="bidOpenDate" value={formData.bidOpenDate || ''} onChange={handleChange} error={errors.bidOpenDate} />

              <DatePicker label="Bid Closing Date" name="bidClosingDate" value={formData.bidClosingDate || ''} onChange={handleChange} error={errors.bidClosingDate} />

              <DatePicker label="Approved Date" name="approvedDate" value={formData.approvedDate || ''} onChange={handleChange} />

              <DatePicker label="File Sent to TEC on" name="fileSentToTecDate" value={formData.fileSentToTecDate || ''} onChange={handleChange} error={errors.fileSentToTecDate} />

              <DatePicker label="File Sent to TEC on Second Time" name="fileSentToTecSecondTime" value={formData.fileSentToTecSecondTime || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Bid Bond */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Bid Bond
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Bid Bond Number" name="bidBondNumber" value={formData.bidBondNumber || ''} onChange={handleChange} placeholder="e.g. BB-2023-001" />

              <Input label="Bank/PIV" name="bidBondBank" value={formData.bidBondBank || ''} onChange={handleChange} placeholder="e.g. Bank of Ceylon" />

              <DatePicker label="Bid Validity Period (Expire Date)" name="bidValidityPeriod" value={formData.bidValidityPeriod || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Remark and Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Remark" name="remark" value={formData.remark || ''} onChange={handleChange} options={remarkOptions} />

              <Select label="Status" name="status" value={formData.status || 'Under Evaluation'} onChange={handleChange} options={statusOptions} />
            </div>
          </div>

          {/* TEC Committee */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              TEC Committee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="TEC Committee Number" name="tecCommitteeNumber" value={formData.tecCommitteeNumber || ''} onChange={handleCommitteeChange} error={errors.tecCommitteeNumber} options={committeeOptions} />

              <div className="bg-slate-50/80 backdrop-blur-sm rounded-lg p-5 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between py-1 border-b border-white/50">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Chairman</span>
                  <span className="text-sm text-slate-900 font-bold">{formData.tecChairman || 'Not Selected'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/50">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Member 1</span>
                  <span className="text-sm text-slate-800 font-semibold">{formData.tecMember1 || 'Not Selected'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Member 2</span>
                  <span className="text-sm text-slate-800 font-semibold">{formData.tecMember2 || 'Not Selected'}</span>
                </div>
              </div>

              {formData.status === 'Awarded' && formData.delay !== undefined && <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Delay (Days)
                  </label>
                  <div className="flex h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    {formData.delay} days
                  </div>
                </div>}
            </div>
          </div>

          {/* Selected Bidder Details */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Selected Bidder Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Awarded To" name="awardedTo" value={formData.awardedTo || ''} onChange={handleChange} options={bidderOptions} />

              <div></div>

              <DatePicker label="Start Date of Service Agreement" name="serviceAgreementStartDate" value={formData.serviceAgreementStartDate || ''} onChange={handleChange} />

              <DatePicker label="End Date of Service Agreement" name="serviceAgreementEndDate" value={formData.serviceAgreementEndDate || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Performance Bond */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-100">
              Performance Bond
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Performance Bond Number" name="performanceBondNumber" value={formData.performanceBondNumber || ''} onChange={handleChange} placeholder="e.g. PB-2023-001" />

              <Input label="Bank/PIV" name="performanceBondBank" value={formData.performanceBondBank || ''} onChange={handleChange} placeholder="e.g. Sampath Bank" />
            </div>
          </div>

          {/* Final Remark */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <Textarea label="Final Remark" name="performanceBondRemark" value={formData.performanceBondRemark || ''} onChange={handleChange} placeholder="Final remarks and additional notes..." rows={4} />
          </div>

          {/* Form Actions - Sticky Footer */}
          <div className="sticky bottom-0 z-30 mt-8 flex items-center justify-end gap-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 p-6 ring-1 ring-slate-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/records')}>
              Cancel
            </Button>
            <Button type="submit" form="recordForm" leftIcon={<Save className="w-4 h-4" />}>
              Save Record
            </Button>
          </div>
        </form>
      </div>
    </div>;
}