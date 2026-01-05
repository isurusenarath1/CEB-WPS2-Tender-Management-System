import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { KpiCard } from '../components/dashboard/KpiCard';
import { PieChart } from '../components/dashboard/PieChart';
import { BarChart } from '../components/dashboard/BarChart';
import { AgingTable } from '../components/dashboard/AgingTable';
import { mockRecords } from '../utils/mockData';
export function DashboardPage() {
  // Calculate KPIs from mock data
  const total = mockRecords.length;
  const underEvacuation = mockRecords.filter(r => r.status === 'Under Evacuation').length;
  const awarded = mockRecords.filter(r => r.status === 'Awarded').length;
  const rejected = mockRecords.filter(r => r.status === 'Reject').length;
  // Pie Chart Data - Updated with new status values
  const statusCounts = mockRecords.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
  // Bar Chart Data (Mocking monthly data)
  const barData = [{
    name: 'May',
    value: 12
  }, {
    name: 'Jun',
    value: 19
  }, {
    name: 'Jul',
    value: 15
  }, {
    name: 'Aug',
    value: 22
  }, {
    name: 'Sep',
    value: 28
  }, {
    name: 'Oct',
    value: total
  }];
  // Aging Data - calculate based on delay field
  const pendingRecords = mockRecords.filter(r => r.status === 'Under Evacuation' || r.delay !== undefined);
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
  return <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Records" value={total} icon={FileText} color="blue" trend="+12% from last month" />
        <KpiCard title="Under Evacuation" value={underEvacuation} icon={Clock} color="amber" trend="Requires attention" />
        <KpiCard title="Awarded" value={awarded} icon={CheckCircle} color="green" trend="Steady progress" />
        <KpiCard title="Rejected" value={rejected} icon={AlertCircle} color="red" trend="Action needed" />
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