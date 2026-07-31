import { useEffect, useMemo, useRef, useState } from "react";
import { GALLERY_PHOTOS } from "./photos.js";

const COVER_START = "IMG_3351.jpg"; // third June 15, 2026 photo
const COVER_COUNT = 20;

/** Hold each photo, then crossfade. */
const HOLD_MS = 2400;
const FADE_MS = 900;

function photoSrc(file) {
  return `${import.meta.env.BASE_URL}photos/${file}`;
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Fresh random reel each mount: start on third June 15 shot, then random gallery photos. */
function buildCoverPlaylist() {
  const pool = GALLERY_PHOTOS.map((p) => p.file).filter((f) => f !== COVER_START);
  const picked = shuffle(pool).slice(0, Math.max(0, COVER_COUNT - 1));
  return [COVER_START, ...picked];
}

/**
 * Landing cover: Brand → Promise → Proof → Action.
 * Dual-buffer crossfade; chrome stays above the reel at all times.
 * Every fresh page load starts here; Enter opens the archive in-session.
 */
export default function CoverGate({ onEnter }) {
  const playlist = useMemo(() => buildCoverPlaylist(), []);
  const [index, setIndex] = useState(0);
  const [front, setFront] = useState(0);
  const [slots, setSlots] = useState(() => [
    playlist[0],
    playlist[Math.min(1, playlist.length - 1)],
  ]);
  const indexRef = useRef(0);
  const frontRef = useRef(0);
  const playlistRef = useRef(playlist);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    frontRef.current = front;
  }, [front]);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const files = playlistRef.current;
    if (files.length < 2) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fade = reduce ? 0 : FADE_MS;

    const id = window.setInterval(() => {
      const current = indexRef.current;
      const next = (current + 1) % files.length;
      const nextFile = files[next];
      const back = frontRef.current === 0 ? 1 : 0;

      setSlots((prevSlots) => {
        const copy = [...prevSlots];
        copy[back] = nextFile;
        return copy;
      });

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setFront(back);
          frontRef.current = back;
          setIndex(next);
          indexRef.current = next;
        });
      });
    }, HOLD_MS + fade);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const files = playlist;
    if (files.length < 2) return undefined;
    const upcoming = files[(index + 1) % files.length];
    const img = new Image();
    img.src = photoSrc(upcoming);
    return undefined;
  }, [index, playlist]);

  function enter() {
    onEnter();
  }

  return (
    <section className="cover-gate" aria-label="Welcome">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
      />

      <div className="cover-gate__media" aria-hidden="true">
        {slots.map((file, slot) => {
          const isFront = slot === front;
          return (
            <img
              key={slot}
              className={`cover-gate__img${isFront ? " is-active" : ""}`}
              src={photoSrc(file)}
              alt=""
              width={1050}
              height={1400}
              fetchPriority={slot === 0 ? "high" : "low"}
              decoding="async"
              style={{
                opacity: isFront ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease-in-out`,
              }}
            />
          );
        })}
      </div>

      <div className="cover-gate__chrome">
        <div className="cover-gate__panel">
          <p className="cover-gate__hello">Hi! Hello!</p>
          <h1 className="cover-gate__title">
            <span className="cover-gate__im">I&apos;m</span>{" "}
            <span className="cover-gate__zero">Zero</span>
          </h1>
          <p className="cover-gate__lede">Welcome to my site.</p>
          <p className="cover-gate__meta">Specimen Record · Canine Division</p>
          <div className="cover-gate__actions">
            <button type="button" className="cover-gate__enter" onClick={enter}>
              Enter the site
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
