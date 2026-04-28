import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

function TransactionForm({ userId, onTransactionAdded, editingTransaction, onEditComplete }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNotes(editingTransaction.notes || '');
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setAmount('');
    setType('EXPENSE');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      userId,
      amount: parseFloat(amount),
      type,
      category,
      date,
      notes
    };

    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, payload);
        onEditComplete();
      } else {
        await api.post('/transactions', payload);
        onTransactionAdded();
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in">
      <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
        {editingTransaction && (
          <button onClick={onEditComplete} className="btn-icon" style={{ fontSize: '0.875rem' }}>Cancel</button>
        )}
      </h3>
      
      {error && <div className="badge badge-expense" style={{ display: 'block', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2">
          <div className="form-group">
            <label>Type</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input 
              type="number" 
              step="0.01"
              min="0.01"
              className="form-input" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2">
          <div className="form-group">
            <label>Category</label>
            <input 
              type="text" 
              className="form-input" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required 
              placeholder="e.g. Groceries, Salary"
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              className="form-input" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes (Optional)</label>
          <input 
            type="text" 
            className="form-input" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Brief description..."
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Saving...' : (editingTransaction ? 'Update Transaction' : 'Add Transaction')}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;
