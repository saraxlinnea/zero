import { useSceneContext } from "./SceneContext.jsx";
import { getMood } from "./tokens.js";

export default function AmbientLayer() {
  const { mood } = useSceneContext();
  const m = getMood(mood);

  return (
    <div
      className="layer-ambient"
      aria-hidden="true"
      style={{
        "--ambient-base": m.base,
        "--ambient-wash-opacity": m.washOpacity,
        "--ambient-texture-opacity": m.textureOpacity,
        "--ambient-warm": m.warm.color,
        "--ambient-warm-x": `${m.warm.x}%`,
        "--ambient-warm-y": `${m.warm.y}%`,
        "--ambient-cool": m.cool.color,
        "--ambient-cool-x": `${m.cool.x}%`,
        "--ambient-cool-y": `${m.cool.y}%`,
      }}
    >
      <div className="layer-ambient__wash layer-ambient__wash--warm" />
      <div className="layer-ambient__wash layer-ambient__wash--cool" />
      <div className="layer-ambient__texture" />
      <div className="layer-ambient__vignette" />
      <div className="layer-ambient__flora layer-ambient__flora--tl" />
      <div className="layer-ambient__flora layer-ambient__flora--tr" />
      <div className="layer-ambient__flora layer-ambient__flora--bl" />
      <div className="layer-ambient__flora layer-ambient__flora--br" />
      <div className="layer-ambient__flora layer-ambient__flora--contour" />
    </div>
  );
}
