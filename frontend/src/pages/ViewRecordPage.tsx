import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Users, Shield, Building2, Tag, Info, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Record as TmsRecord } from '../utils/types';

export function ViewRecordPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = useState<TmsRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecord = async () => {
      try {
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('mock-auth-token');
        const res = await fetch(`/api/records/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          const data = await res.json();
          setRecord({ ...data, id: data._id || data.id });
        }
      } catch (err) {
        console.error('Failed to load record', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecord();
  }, [id]);

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return 'Not Set';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoBlock = ({ label, value, icon: Icon }: { label: string; value: string | number | undefined; icon?: any }) => (
    <div className="flex flex-col space-y-1">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span className="text-sm font-bold text-slate-800 break-words">{value || 'N/A'}</span>
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-3 border-b border-slate-100">
      <Icon className="w-5 h-5 text-[#bd5d2a]" />
      {title}
    </h3>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bd5d2a]"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Record not found</h2>
        <Button onClick={() => navigate('/records')} className="mt-4">Back to Records</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/records')} className="p-2 hover:bg-white/50 rounded-full transition-colors backdrop-blur-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {record.tenderNumber}
              </h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white shadow-sm ring-1 ring-slate-200 text-slate-600`}>
                {record.status}
              </span>
            </div>
            <p className="text-slate-500 font-medium">{record.category} • {record.relevantTo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/records/edit/${record.id}`)} className="bg-white/50 backdrop-blur-sm">
            Edit Record
          </Button>
          <Button onClick={() => navigate('/records')}>
            Close View
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-24">
          
          {/* Main Info Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionTitle title="General Information" icon={FileText} />
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Description</span>
                  <p className="text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {record.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  <InfoBlock label="Other/Staff" value={record.other} icon={Users} />
                  <InfoBlock label="Remark" value={record.remark} icon={Info} />
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Delay
                    </span>
                    <span className={`text-sm font-bold ${record.delay ? 'text-red-600' : 'text-slate-800'}`}>
                      {record.delay !== undefined ? `${record.delay} days` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionTitle title="Timeline & Milestone Dates" icon={Clock} />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                <InfoBlock label="Bid Start Date" value={formatDate(record.bidStartDate)} icon={Calendar} />
                <InfoBlock label="Bid Opening Date" value={formatDate(record.bidOpenDate)} icon={Calendar} />
                <InfoBlock label="Bid Closing Date" value={formatDate(record.bidClosingDate)} icon={Calendar} />
                <InfoBlock label="Approved Date" value={formatDate(record.approvedDate)} icon={CheckCircle2} />
                <InfoBlock label="File Sent to TEC" value={formatDate(record.fileSentToTecDate)} icon={FileText} />
                <InfoBlock label="Second Submission" value={formatDate(record.fileSentToTecSecondTime)} icon={FileText} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionTitle title="Selected Bidder Details" icon={Building2} />
              <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                <div className="col-span-2">
                  <InfoBlock label="Awarded Contractor/Bidder" value={record.awardedTo} icon={Building2} />
                </div>
                <InfoBlock label="Service Agreement Start" value={formatDate(record.serviceAgreementStartDate)} icon={Calendar} />
                <InfoBlock label="Service Agreement End" value={formatDate(record.serviceAgreementEndDate)} icon={Calendar} />
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionTitle title="TEC Committee" icon={Users} />
              <div className="space-y-6">
                <div className="bg-[#bd5d2a]/5 rounded-xl p-4 border border-[#bd5d2a]/10">
                  <span className="text-[10px] font-black text-[#bd5d2a] uppercase tracking-[0.2em] mb-1 block">Committee Number</span>
                  <span className="text-xl font-black text-slate-800">{record.tecCommitteeNumber || 'N/A'}</span>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chairman</span>
                    <span className="text-sm font-extrabold text-slate-800">{record.tecChairman || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Member 1</span>
                    <span className="text-sm font-bold text-slate-700">{record.tecMember1 || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Member 2</span>
                    <span className="text-sm font-bold text-slate-700">{record.tecMember2 || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <SectionTitle title="Guarantees & Bonds" icon={Shield} />
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    Bid Bond
                  </h4>
                  <div className="space-y-3 pl-3.5 border-l border-slate-100">
                    <InfoBlock label="Bond Number" value={record.bidBondNumber} />
                    <InfoBlock label="Issuing Bank" value={record.bidBondBank} />
                    <InfoBlock label="Validity Expire" value={formatDate(record.bidValidityPeriod)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Performance Bond
                  </h4>
                  <div className="space-y-3 pl-3.5 border-l border-slate-100">
                    <InfoBlock label="Bond Number" value={record.performanceBondNumber} />
                    <InfoBlock label="Issuing Bank" value={record.performanceBondBank} />
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Bond Remark</span>
                      <p className="text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                        {record.performanceBondRemark || 'No additional remarks'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
