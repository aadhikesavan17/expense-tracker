import { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import api from '../api/axiosConfig';

function Dashboard({ user, onLogout }) {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.get(`/transactions/dashboard?userId=${user.id}`);
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary', err);
    }
  }, [user.id]);

  const fetchTransactions = useCallback(async () => {
    try {
      let url = `/transactions?userId=${user.id}`;
      // Basic filter logic, backend has month/year support
      if (month && year) {
        url += `&month=${month}&year=${year}`;
      }
      const res = await api.get(url);
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
  }, [user.id, month, year]);

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [fetchSummary, fetchTransactions]);

  const handleTransactionChange = () => {
    fetchSummary();
    fetchTransactions();
    setEditingTransaction(null);
  };

  const currentMonthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="container animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
          <div className="glass-panel stat-card">
            <span className="label">Total Balance</span>
            <span className="value" style={{ color: summary.balance >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
              ${summary.balance?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="glass-panel stat-card">
            <span className="label">Total Income</span>
            <span className="value text-success">
              +${summary.totalIncome?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="glass-panel stat-card">
            <span className="label">Total Expense</span>
            <span className="value text-danger">
              -${summary.totalExpense?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2">
          {/* Left Column: Form */}
          <div>
            <TransactionForm 
              userId={user.id} 
              onTransactionAdded={handleTransactionChange}
              editingTransaction={editingTransaction}
              onEditComplete={handleTransactionChange}
            />
          </div>

          {/* Right Column: List & Filters */}
          <div>
            <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Transactions for {currentMonthName}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select className="form-select" style={{ width: 'auto', padding: '0.5rem' }} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'short' })}</option>
                  ))}
                </select>
                <select className="form-select" style={{ width: 'auto', padding: '0.5rem' }} value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {[year - 1, year, year + 1].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <TransactionList 
              transactions={transactions} 
              onEdit={setEditingTransaction}
              onDelete={handleTransactionChange}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
