interface ImageLinkFormProps {
  input: string;
  isProcessing: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

const ImageLinkForm = ({
  input,
  isProcessing,
  onInputChange,
  onSubmit
}: ImageLinkFormProps) => (
  <div>
    <p className="white f3">This Magic Will Detect Faces. Try it Out.</p>
    <div className="center">
      <div className="form center pa4 br3 shadow-4">
        <input
          aria-label="Image URL"
          className="f3 pa2 w-70 center"
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
        />
        <button
          className="w-30 grow f4 link ph3 pv2 dib bg-light-purple"
          type="button"
          disabled={isProcessing}
          onClick={onSubmit}
        >
          {isProcessing ? 'Detecting...' : 'Detect'}
        </button>
      </div>
    </div>
  </div>
);

export default ImageLinkForm;
