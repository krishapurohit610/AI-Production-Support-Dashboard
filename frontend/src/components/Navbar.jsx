import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <h2>AI Production Support Dashboard</h2>
            <div className="nav-links">
                <Link to="/">Dashboard</Link>
                <Link to="/logs">Logs</Link>
                <Link to="/incidents">Incidents</Link>
                <Link to="/reports">Reports</Link>
                <Link to="/knowledge-base">Knowledge Base</Link>
            </div>
        </nav>
    );
}

export default Navbar;