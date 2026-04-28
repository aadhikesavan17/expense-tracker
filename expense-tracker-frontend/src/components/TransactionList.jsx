import { Pencil, Trash2 } from 'lucide-react';
import api from '../api/axiosConfig';

function TransactionList({ transactions, onEdit, onDelete, refreshTransactions }) {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        onDelete();
      } catch (err) {
        console.error('Failed to delete transaction', err);
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No transactions found for this period.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '0' }}>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Notes</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.category}</td>
                <td>
                  <span className={`badge ${t.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                    {t.type}
                  </span>
                </td>
                <td className={t.type === 'INCOME' ? 'text-success' : 'text-danger'} style={{ fontWeight: '500' }}>
                  {t.type === 'INCOME' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t.notes || '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => onEdit(t)} className="btn-icon" title="Edit">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionList;
