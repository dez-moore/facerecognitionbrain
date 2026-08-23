export type Route = 'signin' | 'register' | 'home';

export interface User {
  id: number;
  name: string;
  email: string;
  entries: number;
  joined: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface RegistrationDetails extends SignInCredentials {
  name: string;
}

export interface NormalizedFaceBox {
  leftCol: number;
  topRow: number;
  rightCol: number;
  bottomRow: number;
}

export interface FaceBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ImageSize {
  width: number;
  height: number;
}
