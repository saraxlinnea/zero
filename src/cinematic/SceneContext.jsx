import { createContext, useContext, useMemo } from "react";

const SceneContext = createContext({ mood: "default" });

export function SceneProvider({ mood = "default", children }) {
  const value = useMemo(() => ({ mood }), [mood]);
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

export function useSceneContext() {
  return useContext(SceneContext);
}
