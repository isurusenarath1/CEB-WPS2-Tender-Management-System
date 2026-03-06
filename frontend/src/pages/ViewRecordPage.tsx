import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, Shield, Building2, 
  Tag, Info, 
  Edit3, AlertCircle, History, ClipboardList
} from 'lucide-react';
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


  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Under Evaluation': 'bg-amber-50 text-amber-700 border-amber-200',
      'Doc Review': 'bg-blue-50 text-blue-700 border-blue-200',
      'Negotiate or Clarification': 'bg-purple-50 text-purple-700 border-purple-200',
      'Re-evaluation': 'bg-orange-50 text-orange-700 border-orange-200',
      'Reject': 'bg-red-50 text-red-700 border-red-200',
      'Awarded': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Cancel': 'bg-slate-50 text-slate-700 border-slate-200',
      'Close': 'bg-slate-100 text-slate-800 border-slate-300',
      'Retender': 'bg-yellow-50 text-yellow-800 border-yellow-200',
      'In PPC': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return colors[status] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr || dateStr === '') return 'Not Set';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-GB', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) {
      return 'Not Set';
    }
  };

  const TimelineItem = ({ label, date, done }: { label: string; date: string; done?: boolean }) => (
    <div className="relative pl-6 pb-6 last:pb-0 group">
      <div className="absolute left-0 top-0 h-full w-px bg-slate-200 print:bg-slate-300 group-last:h-0"></div>
      <div className={`absolute left-[-4px] top-1.5 h-2 w-2 rounded-full border-2 border-white ring-1 ${done ? 'bg-emerald-500 ring-emerald-100' : 'bg-slate-300 ring-slate-100'}`}></div>
      <div className="flex flex-col">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${done ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
        <span className="text-sm font-semibold text-slate-900 mt-0.5">{date}</span>
      </div>
    </div>
  );

  const StatCard = ({ label, value, icon: Icon }: { label: string; value: string | number | undefined; icon: any }) => (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-bold text-slate-900 truncate">{value || '—'}</div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#bd5d2a]"></div>
          <span className="text-sm font-medium text-slate-500">Loading Record...</span>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-12 text-center bg-white rounded-xl shadow-sm border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-900 mb-2">Record Not Found</h2>
        <Button onClick={() => navigate('/records')} variant="outline">Back to Records</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col print:h-auto print:max-w-none print:m-0 print:block">
      {/* Header Area */}
      <div className="flex-shrink-0 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 print:mb-8 print:border-b print:pb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/records')} 
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors print:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 uppercase">
                {record.tenderNumber}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 mt-1 text-slate-500 font-medium text-xs">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> {record.category}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> {record.relevantTo}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 print:hidden">
          {/* <Button variant="outline" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Print
          </Button> */}
          <Button variant="outline" onClick={() => navigate(`/records/edit/${record.id}`)} leftIcon={<Edit3 className="w-4 h-4" />}>
            Edit
          </Button>
          <Button onClick={() => navigate('/records')}>
            Done
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar print:overflow-visible print:h-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10 print:block">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Description</h3>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {record.description || 'No description provided.'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-2">
              <StatCard label="TEC Committee" value={record.tecCommitteeNumber} icon={Users} />
              <StatCard label="Bid Bond Bank/PIV" value={record.bidBondBank} icon={Building2} />
              <StatCard label="Other Staff" value={record.other} icon={Users} />
              <StatCard label="Remark" value={record.remark} icon={Info} />
            </div>

            {/* Awarded Details */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
               <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Awarded Contractor
                  </h3>
               </div>
               <div className="p-6">
                 <div className="text-xl font-bold text-slate-900 mb-4">
                    {record.awardedTo || '—'}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Agreement Start</span>
                      <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(record.serviceAgreementStartDate)}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Agreement End</span>
                      <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(record.serviceAgreementEndDate)}
                      </span>
                    </div>
                 </div>
               </div>
            </div>

            {/* Security Bonds */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
               <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Bid Bond
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                      <span className="font-medium text-slate-500">Bond Number</span>
                      <span className="font-bold text-slate-700">{record.bidBondNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                      <span className="font-medium text-slate-500">Validity Period</span>
                      <span className="font-bold text-slate-700">{formatDate(record.bidValidityPeriod)}</span>
                    </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Performance Bond
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                      <span className="font-medium text-slate-500">Bond Number</span>
                      <span className="font-bold text-slate-700">{record.performanceBondNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                      <span className="font-medium text-slate-500">Remark</span>
                      <span className="font-bold text-slate-700 truncate max-w-[120px]">{record.performanceBondRemark || 'N/A'}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Side Column - Milestones & Team */}
          <div className="space-y-6 print:mt-10">
            {/* Timeline */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 print:bg-white">
               <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                 <History className="w-3.5 h-3.5 text-slate-400" /> Milestones
               </h3>
               <div className="space-y-0">
                 <TimelineItem label="Publication" date={formatDate(record.bidStartDate)} done={!!record.bidStartDate} />
                 <TimelineItem label="Bid Opening" date={formatDate(record.bidOpenDate)} done={!!record.bidOpenDate} />
                 <TimelineItem label="Bid Closing" date={formatDate(record.bidClosingDate)} done={!!record.bidClosingDate} />
                 <TimelineItem label="TEC Review" date={formatDate(record.fileSentToTecDate)} done={!!record.fileSentToTecDate} />
                 <TimelineItem label="Approval" date={formatDate(record.approvedDate)} done={!!record.approvedDate} />
               </div>
            </div>

            {/* TEC Team */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" /> TEC Team
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Chairman</span>
                  <span className="text-xs font-bold text-slate-800">{record.tecChairman || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Member 1</span>
                  <span className="text-xs font-bold text-slate-800">{record.tecMember1 || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Member 2</span>
                  <span className="text-xs font-bold text-slate-800">{record.tecMember2 || '—'}</span>
                </div>
                {record.tecAdditionalMembers && record.tecAdditionalMembers.length > 0 && record.tecAdditionalMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Member {index + 3}</span>
                    <span className="text-xs font-bold text-slate-800">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Efficiency Stat (Simple) */}
            <div className="p-6 bg-slate-900 rounded-xl text-white print:bg-white print:text-slate-900 print:border print:border-slate-200">
               <div className="flex items-center justify-between mb-1">
                 <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Turnaround Delay</span>
               </div>
               <div className="text-2xl font-bold">
                 {record.delay !== undefined ? (record.delay > 0 ? `+${record.delay}` : record.delay) : '—'} 
                 <span className="text-[10px] uppercase ml-1.5 opacity-40">Days</span>
               </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Print styles */}
      <style>{`
        @media print {
          nav, aside, header, button, .print\\:hidden, [role="navigation"] {
             display: none !important;
          }
          body, html, #root, .flex.h-screen {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }
          main {
            overflow: visible !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .max-w-5xl, .mx-auto {
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
          }
          .h-\\[calc\\(100vh-140px\\)\\] {
            height: auto !important;
          }
          .bg-white, .bg-slate-50, .bg-slate-900, .rounded-xl {
            border: 1px solid #e2e8f0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            break-inside: avoid !important;
          }
          .text-white, .text-slate-400 { color: #1e293b !important; }
          .print-footer {
            display: block !important;
            margin-top: 3rem;
            text-align: right;
            font-size: 10px;
            color: #94a3b8;
          }
          @page { margin: 2cm; }
        }
      `}</style>
      <div className="hidden print:block print-footer">
        Generated by Tender Management System | {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}
