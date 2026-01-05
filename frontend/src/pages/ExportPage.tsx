import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { DatePicker } from '../components/ui/DatePicker';
export function ExportPage() {
  const [exportFormat, setExportFormat] = useState('excel');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const handleExportRecords = () => {
    console.log('Exporting system records...', {
      exportFormat,
      dateFrom,
      dateTo,
      category,
      status
    });
    // Simulate download
    alert(`Downloading System Records as ${exportFormat.toUpperCase()}...`);
  };
  const handleDownloadTechnicalGood = () => {
    console.log('Downloading Technical Evaluation Good document...');
    // Simulate download
    alert('Downloading Technical Evaluation Good.docx...');
  };
  const handleDownloadTechnicalService = () => {
    console.log('Downloading Final Technical Evaluation Service document...');
    // Simulate download
    alert('Downloading Final Technical Evaluation Service.docx...');
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Export Data</h2>
        <p className="text-slate-500">
          Download system records and technical evaluation documents
        </p>
      </div>

      {/* Download System Records */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Download System Records
            </h3>
            <p className="text-sm text-slate-500">
              Export all tender records with customizable filters and date
              ranges
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label="Export Format" value={exportFormat} onChange={e => setExportFormat(e.target.value)} options={[{
            value: 'excel',
            label: 'Excel (.xlsx)'
          }, {
            value: 'csv',
            label: 'CSV (.csv)'
          }, {
            value: 'pdf',
            label: 'PDF (.pdf)'
          }]} />

            <Select label="Category Filter" value={category} onChange={e => setCategory(e.target.value)} options={[{
            value: 'All',
            label: 'All Categories'
          }, {
            value: 'Goods',
            label: 'Goods'
          }, {
            value: 'Services',
            label: 'Services'
          }, {
            value: 'Works',
            label: 'Works'
          }, {
            value: 'Consultancy',
            label: 'Consultancy'
          }]} />

            <Select label="Status Filter" value={status} onChange={e => setStatus(e.target.value)} options={[{
            value: 'All',
            label: 'All Status'
          }, {
            value: 'Under Evacuation',
            label: 'Under Evacuation'
          }, {
            value: 'Doc Review',
            label: 'Doc Review'
          }, {
            value: 'Awarded',
            label: 'Awarded'
          }, {
            value: 'Reject',
            label: 'Reject'
          }, {
            value: 'Close',
            label: 'Close'
          }]} />

            <div className="flex items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date Range (Optional)
                </label>
                <p className="text-xs text-slate-500">
                  Leave empty for all records
                </p>
              </div>
            </div>

            <DatePicker label="From Date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />

            <DatePicker label="To Date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button onClick={handleExportRecords} leftIcon={<Download className="w-4 h-4" />}>
              Download System Records
            </Button>
          </div>
        </div>
      </div>

      {/* Technical Evaluation Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Evaluation Good */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Technical Evaluation Good
              </h3>
              <p className="text-sm text-slate-500">
                Download the technical evaluation template for goods procurement
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">File Format:</span>
              <span className="font-medium text-slate-900">
                Microsoft Word (.docx)
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-600">Template Type:</span>
              <span className="font-medium text-slate-900">
                Goods Evaluation
              </span>
            </div>
          </div>

          <Button onClick={handleDownloadTechnicalGood} leftIcon={<Download className="w-4 h-4" />} className="w-full" variant="secondary">
            Download Template
          </Button>
        </div>

        {/* Final Technical Evaluation Service */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Final Technical Evaluation Service
              </h3>
              <p className="text-sm text-slate-500">
                Download the final technical evaluation template for service
                contracts
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">File Format:</span>
              <span className="font-medium text-slate-900">
                Microsoft Word (.docx)
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-slate-600">Template Type:</span>
              <span className="font-medium text-slate-900">
                Service Evaluation
              </span>
            </div>
          </div>

          <Button onClick={handleDownloadTechnicalService} leftIcon={<Download className="w-4 h-4" />} className="w-full" variant="secondary">
            Download Template
          </Button>
        </div>
      </div>

      {/* Export Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Export Information
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • System records include all tender information, dates, and
                committee details
              </li>
              <li>
                • Technical evaluation templates are pre-formatted Word
                documents
              </li>
              <li>
                • All exports are generated in real-time based on current data
              </li>
              <li>
                • Downloaded files are saved to your default downloads folder
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>;
}