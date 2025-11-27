import { Html, useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="text-white text-lg bg-black/70 px-6 py-4 rounded-xl text-center">
        Loading 3D Model...
        <br />
        {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default Loader;
