import { LogOut, Wallet } from 'lucide-react';

function Navbar({ user, onLogout }) {
  return (
    <nav className="glass-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Wallet color="var(--accent-primary)" size={28} />
        <h2 style={{ margin: 0, fontSize: '1.25rem', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ExpenseTracker
        </h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Welcome, <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong>
        </span>
        <button onClick={onLogout} className="btn-icon" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
