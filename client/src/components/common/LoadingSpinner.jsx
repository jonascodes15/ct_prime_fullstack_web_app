import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 40, fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className="spinner-ring" style={{ width: size, height: size }} />
        <p>Loading...</p>
      </div>
    );
  }
  return <div className="spinner-ring" style={{ width: size, height: size }} />;
}
