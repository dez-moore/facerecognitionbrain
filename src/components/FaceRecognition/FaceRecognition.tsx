import type { SyntheticEvent } from 'react';
import './FaceRecognition.css';
import type { FaceBox, ImageSize } from '../../types';

interface FaceRecognitionProps {
  imageUrl: string;
  box: FaceBox | null;
  onImageLoad: (size: ImageSize) => void;
}

const FaceRecognition = ({ imageUrl, box, onImageLoad }: FaceRecognitionProps) => {
  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { height, width } = event.currentTarget;
    if (height > 0 && width > 0) {
      onImageLoad({ height, width });
    }
  };

  return (
    <div className="center ma">
      <div className="absolute mt2">
        {imageUrl && (
          <img
            id="inputImage"
            alt="Submitted for face detection"
            src={imageUrl}
            width="500"
            onLoad={handleImageLoad}
          />
        )}
        {box && <div className="bounding-box" style={box} data-testid="face-box" />}
      </div>
    </div>
  );
};

export default FaceRecognition;
