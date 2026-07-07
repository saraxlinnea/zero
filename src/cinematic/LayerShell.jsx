import AmbientLayer from "./AmbientLayer.jsx";
import MotionLayer from "./MotionLayer.jsx";
import { SceneProvider } from "./SceneContext.jsx";
import "./layers.css";

/**
 * Three-layer cinematic shell:
 * - Ambient (fixed background mood + texture)
 * - Foreground (scrollable page content)
 * - Motion (fixed symbolic parallax elements; paw prints remain in #footprint-layer)
 */
export default function LayerShell({ mood = "default", children }) {
  return (
    <SceneProvider mood={mood}>
      <AmbientLayer />
      <MotionLayer />
      <div className="layer-foreground">{children}</div>
    </SceneProvider>
  );
}
