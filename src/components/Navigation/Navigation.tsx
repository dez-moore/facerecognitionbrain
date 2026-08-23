import type { Route } from '../../types';

interface NavigationProps {
  isSignedIn: boolean;
  onRouteChange: (route: Route) => void;
  onSignOut: () => void;
}

const Navigation = ({ isSignedIn, onRouteChange, onSignOut }: NavigationProps) => (
  <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
    {isSignedIn ? (
      <button className="f3 link dim black underline pa3 pointer bn bg-transparent" onClick={onSignOut}>
        Sign Out!
      </button>
    ) : (
      <>
        <button
          className="f3 link dim black underline pa3 pointer bn bg-transparent"
          onClick={() => onRouteChange('signin')}
        >
          Sign In
        </button>
        <button
          className="f3 link dim black underline pa3 pointer bn bg-transparent"
          onClick={() => onRouteChange('register')}
        >
          Register
        </button>
      </>
    )}
  </nav>
);

export default Navigation;
