import { useEffect, useMemo, useRef, useState } from "react";
import { GALLERY_PHOTOS } from "./photos.js";

/** Curated cover reel: strong outdoor / portrait frames only. */
const COVER_PLAYLIST = [
  "IMG_3351.jpg", // start: June 15 beach
  "IMG_4173.jpg",
  "IMG_4157.jpg",
  "IMG_9048.jpg",
  "IMG_0737.jpg",
  "IMG_3991.jpg",
  "IMG_1686.jpg",
  "IMG_3108.jpg",
];

/** Hold each photo, then crossfade. */
const HOLD_MS = 2800;
const FADE_MS = 900;
/** Cover exit wipe duration (must match CSS). */
const EXIT_MS = 620;

function photoSrc(file) {
  return `${import.meta.env.BASE_URL}photos/${file}`;
}

function buildCoverPlaylist() {
  const available = new Set(GALLERY_PHOTOS.map((p) => p.file));
  const curated = COVER_PLAYLIST.filter((f) => available.has(f));
  if (curated.length >= 2) return curated;
  return GALLERY_PHOTOS.slice(0, 8).map((p) => p.file);
}

/**
 * Landing cover: Brand → Promise → Proof → Action.
 * Dual-buffer crossfade; chrome stays above the reel at all times.
 */
export default function CoverGate({ onEnter, onExitStart }) {
  const playlist = useMemo(() => buildCoverPlaylist(), []);
  const [index, setIndex] = useState(0);
  const [front, setFront] = useState(0);
  const [slots, setSlots] = useState(() => [
    playlist[0],
    playlist[Math.min(1, playlist.length - 1)],
  ]);
  const [exiting, setExiting] = useState(false);
  const indexRef = useRef(0);
  const frontRef = useRef(0);
  const playlistRef = useRef(playlist);
  const exitTimerRef = useRef(null);
  const enterBtnRef = useRef(null);

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
    enterBtnRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const files = playlistRef.current;
    if (files.length < 2 || exiting) return undefined;

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
  }, [exiting]);

  useEffect(() => {
    const files = playlist;
    if (files.length < 2) return undefined;
    const nextA = files[(index + 1) % files.length];
    const nextB = files[(index + 2) % files.length];
    [nextA, nextB].forEach((file) => {
      const img = new Image();
      img.src = photoSrc(file);
    });
    return undefined;
  }, [index, playlist]);

  function enter() {
    if (exiting) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onEnter();
      return;
    }

    setExiting(true);
    onExitStart?.();
    exitTimerRef.current = window.setTimeout(() => {
      onEnter();
    }, EXIT_MS);
  }

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape" && !exiting) {
        event.preventDefault();
        enter();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exiting]);

  return (
    <section
      className={`cover-gate${exiting ? " is-exiting" : ""}`}
      aria-label="Welcome"
      aria-hidden={exiting || undefined}
    >
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
                transition: exiting ? "none" : `opacity ${FADE_MS}ms ease-in-out`,
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
            <button
              ref={enterBtnRef}
              type="button"
              className="cover-gate__enter"
              onClick={enter}
              disabled={exiting}
            >
              Open specimen record
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
