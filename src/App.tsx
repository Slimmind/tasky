import SiteHeader from './components/site-header';
import SiteFooter from './components/site-footer';
// import { useAuth } from './contexts/auth.context';
import './index.css';

function App() {
	// const { currentUser, login, signup, loginWithGoogle, logout } = useAuth();
	return (
		<>
			<SiteHeader />
			<main></main>
			<SiteFooter />
		</>
	);
}

export default App;
