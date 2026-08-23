import { useMemo, useState } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import './App.css';
import { detectFace, getErrorMessage, incrementEntries } from './api';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import type { ImageSize, NormalizedFaceBox, Route, User } from './types';

const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true
      }
    }
  }
};

const emptyUser: User = {
  id: 0,
  name: '',
  email: '',
  entries: 0,
  joined: ''
};

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [face, setFace] = useState<NormalizedFaceBox | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [route, setRoute] = useState<Route>('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User>(emptyUser);
  const [imageError, setImageError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const box = useMemo(() => {
    if (!face || !imageSize) {
      return null;
    }

    return {
      left: face.leftCol * imageSize.width,
      top: face.topRow * imageSize.height,
      right: imageSize.width - face.rightCol * imageSize.width,
      bottom: imageSize.height - face.bottomRow * imageSize.height
    };
  }, [face, imageSize]);

  const onSubmit = async () => {
    if (!input.trim()) {
      setImageError('Enter an image URL to detect a face.');
      return;
    }

    setImageUrl(input.trim());
    setFace(null);
    setImageSize(null);
    setImageError('');
    setIsProcessing(true);

    try {
      const detectedFace = await detectFace(input.trim());
      setFace(detectedFace);
      const entries = await incrementEntries(user.id);
      setUser((currentUser) => ({ ...currentUser, entries }));
    } catch (error) {
      setImageError(getErrorMessage(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const onRouteChange = (nextRoute: Route) => {
    setRoute(nextRoute);
    setImageError('');
    if (nextRoute === 'home') {
      setIsSignedIn(true);
    }
  };

  const onSignOut = () => {
    setInput('');
    setImageUrl('');
    setFace(null);
    setImageSize(null);
    setRoute('signin');
    setIsSignedIn(false);
    setUser(emptyUser);
    setImageError('');
    setIsProcessing(false);
  };

  return (
    <ParticlesProvider init={loadSlim}>
      <div className="App">
        <Particles className="particles" options={particleOptions} />
        <Navigation
          onRouteChange={onRouteChange}
          onSignOut={onSignOut}
          isSignedIn={isSignedIn}
        />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              input={input}
              isProcessing={isProcessing}
              onInputChange={setInput}
              onSubmit={onSubmit}
            />
            {imageError && <p className="white" role="alert">{imageError}</p>}
            <FaceRecognition imageUrl={imageUrl} box={box} onImageLoad={setImageSize} />
          </div>
        ) : route === 'signin' ? (
          <SignIn loadUser={setUser} onRouteChange={onRouteChange} />
        ) : (
          <Register loadUser={setUser} onRouteChange={onRouteChange} />
        )}
      </div>
    </ParticlesProvider>
  );
};

export default App;
