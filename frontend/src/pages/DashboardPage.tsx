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

  // Category Chart Data
  const categoryCounts = records.reduce((acc, record) => {
    const cat = record.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value: Number(value)
  }));

  // Aging Data
  const today = new Date();
  const terminalStatuses = ['awarded', 'reject', 'rejected', 'cancel', 'cancelled', 'close', 'closed'];
  
  const activePendingRecords = records.filter(r => {
    const s = (r.status || '').toString().toLowerCase();
    return !terminalStatuses.includes(s) && r.bidOpenDate;
  });

  const getAgeInDays = (openDateStr: string) => {
    const openDate = new Date(openDateStr);
    if (isNaN(openDate.getTime())) return 0;
    const diffTime = Math.abs(today.getTime() - openDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const agingBuckets = activePendingRecords.reduce((acc, r) => {
    const age = getAgeInDays(r.bidOpenDate);
    if (age <= 30) acc['0-30']++;
    else if (age <= 60) acc['31-60']++;
    else if (age <= 90) acc['61-90']++;
    else acc['90+']++;
    return acc;
  }, { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 });

  const agingData = [{
    range: '0-30',
    count: agingBuckets['0-30'],
    color: 'bg-green-100 text-green-800'
  }, {
    range: '31-60',
    count: agingBuckets['31-60'],
    color: 'bg-yellow-100 text-yellow-800'
  }, {
    range: '61-90',
    count: agingBuckets['61-90'],
    color: 'bg-orange-100 text-orange-800'
  }, {
    range: '90+',
    count: agingBuckets['90+'],
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

      {/* Visualizations Grid (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Row 1, Col 1: Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Record Status Distribution
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <PieChart data={pieData} />
          </div>
        </div>
        
        {/* Row 1, Col 2: Monthly Volume */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Monthly Record Volume
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <BarChart data={barData} />
          </div>
        </div>

        {/* Row 2, Col 1: Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Category Wise Distribution
          </h3>
          <div className="flex-1 flex items-center justify-center">
            <BarChart data={categoryData} />
          </div>
        </div>

        {/* Row 2, Col 2: Aging Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Pending Records Aging Analysis
          </h3>
          <div className="flex-1">
            <AgingTable data={agingData} />
          </div>
        </div>
      </div>
    </div>;
}