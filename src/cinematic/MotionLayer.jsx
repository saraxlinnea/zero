import { useSceneContext } from "./SceneContext.jsx";

/**
 * Subtle fixed symbolic accents (light orb + specimen stamp ring).
 * Static now that pinned scroll scenes are removed; opacity shifts gently by tab.
 */
const ORB_OPACITY = {
  cosmos: 0.5,
  character: 0.42,
  gallery: 0.28,
};

export default function MotionLayer() {
  const { mood } = useSceneContext();
  const orbOpacity = ORB_OPACITY[mood] ?? 0.35;

  return (
    <div className="layer-motion" aria-hidden="true">
      <div
        className="layer-motion__orb"
        style={{
          "--orb-x": "72vw",
          "--orb-y": "20vh",
          "--orb-opacity": orbOpacity,
        }}
      />
      <div
        className="layer-motion__stamp"
        style={{
          "--stamp-x": "14vw",
          "--stamp-y": "58vh",
          "--stamp-rot": "-12deg",
          "--stamp-scale": 1,
          "--stamp-opacity": 0.16,
        }}
      />
    </div>
  );
}
