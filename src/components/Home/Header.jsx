import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X, ArrowUpRight, ChevronDown, LogIn, LogOut, UserRound } from 'lucide-react';
import logo from '../../assets/icon.png';
import documents from '../../data/appDocuments.json';
import { useLogoutMutation } from '../../store/api/auth';
import { logout, selectCurrentToken, selectCurrentUser } from '../../store/reducer/auth';
import '../../styles/ngo.css';
export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const [logoutSession, { isLoading: isLoggingOut }] = useLogoutMutation();
  const isAuthenticated = Boolean(token && user?.id);

  const handleLogout = async () => {
    try {
      await logoutSession({}).unwrap();
    } catch {
      // Local cleanup still guarantees that an expired or missing server session signs out.
    } finally {
      dispatch(logout());
      setOpen(false);
      navigate('/', { replace: true });
    }
  };

  const closeNavigation = event => {
    if (!event.target.closest('a')) return;
    setOpen(false);
    event.currentTarget.querySelectorAll('details[open]').forEach(menu => menu.removeAttribute('open'));
  };
  return <header className="ngo-header"><div className="ngo-topline"><span>Cyber Help Desk · Scam Helpline</span><a href="/documents/caws-partnership-proposal.pdf" target="_blank" rel="noreferrer">Our partnership proposal <ArrowUpRight size={13} /></a></div><nav className="ngo-nav" aria-label="Main navigation"><Link to="/" className="ngo-brand" onClick={() => setOpen(false)}><img src={logo} alt="Cyber Help Desk logo" /><span className="ngo-brand-copy"><strong>Cyber Help Desk</strong><span>SCAM HELPLINE</span><small>Powered by Cyber Awareness Welfare Society</small></span></Link><button className="ngo-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="ngo-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button><div id="ngo-navigation" className={`ngo-links ${open ? 'is-open' : ''}`} onClick={closeNavigation} onKeyDown={event => {
        if (event.key === 'Escape') {
          event.currentTarget.querySelectorAll('details[open]').forEach(menu => menu.removeAttribute('open'));
          setOpen(false);
        }
      }}>
 <details className="app-nav-dropdown"><summary>Who we are <ChevronDown size={13} /></summary><div className="app-dropdown-panel"><Link to="/about">About CAWS · overview</Link>{documents.map(doc => <Link key={doc.slug} to={`/${doc.slug}`}>{doc.title}</Link>)}<Link to="/contact-us">Contact us</Link></div></details>
 <a href="/#programmes">Our programmes</a><details className="app-nav-dropdown"><summary>Learn & participate <ChevronDown size={13} /></summary><div className="app-dropdown-panel"><Link to="/live-tests">Live tests & certificates</Link><Link to="/course">Courses & classes</Link><Link to="/mycourse">My enrolled courses</Link><a href="/#learning">Practice awareness quiz</a><Link to="/volunteer">Become a volunteer</Link><Link to="/gallery">Community gallery</Link>{!isAuthenticated && <Link to="/login">Member sign in</Link>}</div></details><Link to="/app-features">The app</Link>{isAuthenticated ? <div className="ngo-auth-actions"><span className="ngo-auth-user" title={user.email || user.phone || user.name}><UserRound size={15} /><span>{user.name || 'Member'}</span></span><button className="ngo-logout-button" type="button" onClick={handleLogout} disabled={isLoggingOut}><LogOut size={15} /> {isLoggingOut ? 'Logging out…' : 'Logout'}</button></div> : <Link className="ngo-login-button" to="/login"><LogIn size={15} /> Login</Link>}<Link className="ngo-button small" to="/partnership">Partner with us <ArrowUpRight size={16} /></Link></div></nav></header>;
}
