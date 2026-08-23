import { useState, type FormEvent } from 'react';
import { getErrorMessage, signIn } from '../../api';
import type { Route, User } from '../../types';

interface SignInProps {
  loadUser: (user: User) => void;
  onRouteChange: (route: Route) => void;
}

const SignIn = ({ loadUser, onRouteChange }: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await signIn({ email, password });
      loadUser(user);
      onRouteChange('home');
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <form className="measure" onSubmit={onSubmit}>
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="signin-email">Email</label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email"
                id="signin-email"
                value={email}
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="signin-password">Password</label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="signin-password"
                value={password}
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </fieldset>
          {error && <p role="alert">{error}</p>}
          <input
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
            type="submit"
            value={isSubmitting ? 'Signing in...' : 'Sign in'}
            disabled={isSubmitting}
          />
          <div className="lh-copy mt3">
            <button
              className="f6 link dim black db pointer bn bg-transparent pa0"
              type="button"
              onClick={() => onRouteChange('register')}
            >
              Register
            </button>
          </div>
        </form>
      </main>
    </article>
  );
};

export default SignIn;
