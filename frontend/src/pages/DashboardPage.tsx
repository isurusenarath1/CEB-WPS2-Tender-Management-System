import { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { KpiCard } from '../components/dashboard/KpiCard';
import { PieChart } from '../components/dashboard/PieChart';
import { BarChart } from '../components/dashboard/BarChart';
import { AgingTable } from '../components/dashboard/AgingTable';
import { Record as TmsRecord } from '../utils/types';

export function DashboardPage() {
  const [records, setRecords] = useState<TmsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = sessionStorage.getItem('mock-auth-token') || sessionStorage.getItem('authToken');
        const res = await fetch('/api/records', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (res.ok) {
          const data = await res.json();
          setRecords(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate KPIs
  const total = records.length;
  const underEvaluation = records.filter(r => {
    const s = (r.status || '').toString().toLowerCase();
    return s.includes('evaluation') || s.includes('evacuation');
  }).length;
  const awarded = records.filter(r => (r.status || '').toString().toLowerCase() === 'awarded').length;
  const retender = records.filter(r => (r.status || '').toString().toLowerCase() === 'retender').length;
  const reEvaluation = records.filter(r => (r.status || '').toString().toLowerCase().includes('re-evaluation')).length;
  
  // Rejected card now includes Cancel and Close
  const rejectCount = records.filter(r => {
    const s = (r.status || '').toString().toLowerCase();
    return s === 'reject' || s === 'rejected';
  }).length;
  const cancelCount = records.filter(r => (r.status || '').toString().toLowerCase().includes('cancel')).length;
  const closeCount = records.filter(r => (r.status || '').toString().toLowerCase().includes('close')).length;
  const rejectedTotal = rejectCount + cancelCount + closeCount;

  const rejectedBreakdown = [
    { label: 'Rejected', value: rejectCount },
    { label: 'Cancelled', value: cancelCount },
    { label: 'Closed', value: closeCount }
  ];

  // Pie Chart Data
  const statusCounts = records.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value: Number(value)
  }));

  // Bar Chart Data
  const barData = [
    { name: 'Total Records', value: total }
  ];

  // Aging Data
  const pendingRecords = records.filter(r => (r.status as string) === 'Under Evaluation' || (r.status as string) === 'Under Evacuation');
  const agingData = [{
    range: '0-30',
    count: pendingRecords.filter(r => (r.delay || 0) <= 30).length,
    color: 'bg-green-100 text-green-800'
  }, {
    range: '31-60',
    count: pendingRecords.filter(r => (r.delay || 0) > 30 && (r.delay || 0) <= 60).length,
    color: 'bg-yellow-100 text-yellow-800'
  }, {
    range: '61-90',
    count: pendingRecords.filter(r => (r.delay || 0) > 60 && (r.delay || 0) <= 90).length,
    color: 'bg-orange-100 text-orange-800'
  }, {
    range: '90+',
    count: pendingRecords.filter(r => (r.delay || 0) > 90).length,
    color: 'bg-red-100 text-red-800'
  }];

  if (isLoading) {
    return <div className="flex items-center justify-center p-12 h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }
  return <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <KpiCard title="Total Records" value={total} icon={FileText} color="blue" trend="+12% from last month" />
        <KpiCard title="Under Evaluation" value={underEvaluation} icon={Clock} color="amber" trend="Requires attention" />
        <KpiCard title="Awarded" value={awarded} icon={CheckCircle} color="green" trend="Steady progress" />
        <KpiCard title="Retender" value={retender} icon={Clock} color="amber" trend="Action required" />
        <KpiCard title="Re evaluation" value={reEvaluation} icon={Clock} color="amber" trend="In progress" />
        <KpiCard 
          title="Rejected" 
          value={rejectedTotal} 
          icon={AlertCircle} 
          color="red" 
          trend="Total count" 
          breakdown={rejectedBreakdown}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Record Status Distribution
          </h3>
          <PieChart data={pieData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Monthly Record Volume
          </h3>
          <BarChart data={barData} />
        </div>
      </div>

      {/* Aging Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Pending Records Aging Analysis
        </h3>
        <AgingTable data={agingData} />
      </div>
    </div>;
}