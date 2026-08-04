import { useSceneContext } from "./SceneContext.jsx";

/**
 * Very quiet fixed accents. Wallpaper carries the atmosphere now.
 */
const ORB_OPACITY = {
  cosmos: 0.18,
  character: 0.12,
  gallery: 0.1,
};

export default function MotionLayer() {
  const { mood } = useSceneContext();
  const orbOpacity = ORB_OPACITY[mood] ?? 0.12;

  return (
    <div className="layer-motion" aria-hidden="true">
      <div
        className="layer-motion__orb"
        style={{
          "--orb-x": "72vw",
          "--orb-y": "18vh",
          "--orb-opacity": orbOpacity,
        }}
      />
    </div>
  );
}
