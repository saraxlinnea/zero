import { useSceneContext } from "./SceneContext.jsx";
import { getMood } from "./tokens.js";

/**
 * Quiet cool fog + tiled wallpaper. No corner flora scatter.
 */
export default function AmbientLayer() {
  const { mood } = useSceneContext();
  const theme = mood || "default";
  const m = getMood(theme);

  return (
    <div
      className={`layer-ambient layer-ambient--${theme}`}
      data-theme={theme}
      aria-hidden="true"
      style={{
        "--ambient-base": m.base,
        "--ambient-wash-opacity": m.washOpacity,
        "--ambient-texture-opacity": m.textureOpacity,
        "--ambient-wallpaper-opacity": m.wallpaperOpacity ?? 0.03,
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
      <div className="layer-ambient__wallpaper" />
      <div className="layer-ambient__texture" />
      <div className="layer-ambient__vignette" />
    </div>
  );
}
