import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2, FiPlus, FiExternalLink } from 'react-icons/fi';

const STATUS_COLORS = {
  applied:     { bg: '#dceeff', color: '#2a6496' },
  interviewed: { bg: '#fff3cd', color: '#856404' },
  offered:     { bg: '#d4edda', color: '#155724' },
  rejected:    { bg: '#fde8e8', color: '#842029' },
};

const ACTION_COLORS = {
  'Prepare Interview': { bg: '#dceeff', color: '#2a6496' },
  'Follow up':         { bg: '#e8f5e9', color: '#2e7d32' },
  'Send email':        { bg: '#fce4ec', color: '#880e4f' },
  'Waiting':           { bg: '#fff8e1', color: '#f57f17' },
  'Decide':            { bg: '#ede7f6', color: '#4527a0' },
};

const NEXT_ACTIONS = ['Prepare Interview', 'Follow up', 'Send email', 'Waiting', 'Decide'];

function Badge({ text, colorMap }) {
  const style = colorMap[text] || { bg: '#f0ebe3', color: '#6b5e4e' };
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      padding: '3px 10px',
      borderRadius: '99px',
      fontSize: '12px',
      fontFamily: 'Georgia, serif',
      whiteSpace: 'nowrap'
    }}>{text}</span>
  );
}

function Dashboard({ onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    company: '', role: '', status: 'applied',
    salary: '', nextAction: 'Waiting',
    jobLink: '', contact: '', notes: ''
  });

  const token = localStorage.getItem('token');

  const getJobs = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/jobs', {
        headers: { Authorization: token }
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addJob = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/jobs', {
        ...form,
        salary: form.salary !== '' ? Number(form.salary) : undefined
      }, {
        headers: { Authorization: token }
      });
      setShowForm(false);
      setForm({ company: '', role: '', status: 'applied', salary: '', nextAction: 'Waiting', jobLink: '', contact: '', notes: '' });
      getJobs();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/jobs/${id}`, {
        headers: { Authorization: token }
      });
      getJobs();
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/jobs/${id}`, { status }, {
        headers: { Authorization: token }
      });
      getJobs();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { getJobs(); }, []);

  const stats = {
    total: jobs.length,
    interviewed: jobs.filter(j => j.status === 'interviewed').length,
    offered: jobs.filter(j => j.status === 'offered').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', padding: '40px 32px' }}>

      {/* Header */}
<div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div>
    <h1 style={{ fontSize: '28px', color: '#3d3426', marginBottom: '4px' }}>🌿 Job Application Tracker</h1>
    <p style={{ color: '#8a7968', fontSize: '14px' }}>Track your journey, stay grounded.</p>
  </div>
  <button onClick={onLogout} style={{ background: '#e8e0d4', color: '#3d3426' }}>Logout</button>
</div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Applied', value: stats.total, bg: '#e8f0e3' },
          { label: 'Interviewed', value: stats.interviewed, bg: '#fff3cd' },
          { label: 'Offered', value: stats.offered, bg: '#d4edda' },
          { label: 'Rejected', value: stats.rejected, bg: '#fde8e8' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: '12px', padding: '16px 24px', minWidth: '130px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3d3426' }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#8a7968' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Job Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ background: '#8a9e7a', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FiPlus /> Add Application
      </button>

      {/* Add Job Form */}
      {showForm && (
        <div style={{ background: '#fdf8f0', border: '1px solid #c8b89a', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', color: '#3d3426' }}>New Application</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { placeholder: 'Company', key: 'company' },
              { placeholder: 'Role', key: 'role' },
              { placeholder: 'Salary', key: 'salary' },
              { placeholder: 'Contact name', key: 'contact' },
              { placeholder: 'Job link (URL)', key: 'jobLink' },
              { placeholder: 'Notes', key: 'notes' },
            ].map(f => (
              <input key={f.key} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
            ))}
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="applied">Applied</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
            <select value={form.nextAction} onChange={e => setForm({ ...form, nextAction: e.target.value })}>
              {NEXT_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={addJob} style={{ background: '#8a9e7a', color: '#fff' }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ background: '#e8e0d4', color: '#3d3426' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #c8b89a' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fdf8f0' }}>
          <thead>
            <tr style={{ background: '#ede8df', textAlign: 'left' }}>
              {['Company', 'Position', 'Status', 'Date Applied', 'Salary', 'Next Action', 'Website', 'Contact', ''].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontSize: '13px', color: '#8a7968', fontWeight: 'normal', borderBottom: '1px solid #c8b89a' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, i) => (
              <tr key={job._id} style={{ borderBottom: '1px solid #e8e0d4', background: i % 2 === 0 ? '#fdf8f0' : '#faf5ec' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3d3426' }}>{job.company}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', color: '#3d3426' }}>{job.role}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select value={job.status}
                    onChange={e => updateStatus(job._id, e.target.value)}
                    style={{ width: 'auto', padding: '4px 8px', fontSize: '12px', border: 'none', background: STATUS_COLORS[job.status]?.bg, color: STATUS_COLORS[job.status]?.color, borderRadius: '99px' }}>
                    <option value="applied">Applied</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8a7968' }}>
                  {new Date(job.appliedDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#3d3426' }}>
                  {job.salary ? `$${Number(job.salary).toLocaleString()}` : '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {job.nextAction ? <Badge text={job.nextAction} colorMap={ACTION_COLORS} /> : '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {job.jobLink ? (
                    <a href={job.jobLink} target="_blank" rel="noreferrer" style={{ color: '#8a9e7a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiExternalLink /> Link
                    </a>
                  ) : '—'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#3d3426' }}>{job.contact || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => deleteJob(job._id)}
                    style={{ background: 'none', color: '#c0392b', padding: '4px', display: 'flex', alignItems: 'center' }}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#8a7968', fontSize: '14px' }}>
                  No applications yet — add your first one! 🌱
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer stats */}
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#8a7968', display: 'flex', gap: '24px' }}>
        <span>COUNT {stats.total}</span>
        <span>INTERVIEWED {stats.interviewed}</span>
        <span>OFFERED {stats.offered}</span>
      </div>

    </div>
  );
}

export default Dashboard;