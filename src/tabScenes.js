/** Per-tab scenic atmosphere: margin photos, crop hints, and ambient mood. */

export const TAB_SCENES = {
  profile: {
    mood: "profile",
    photos: [
      { file: "IMG_4173.jpg", position: "center 18%" },
      { file: "IMG_4157.jpg", position: "center 22%" },
      { file: "IMG_9048.jpg", position: "center 16%" },
      { file: "IMG_0737.jpg", position: "center 28%" },
    ],
  },
  character: {
    mood: "character",
    photos: [
      { file: "IMG_3991.jpg", position: "center 32%" },
      { file: "IMG_6992.jpg", position: "center 35%" },
      { file: "IMG_1686.jpg", position: "center 28%" },
      { file: "IMG_2302.jpg", position: "center 42%" },
    ],
  },
  cosmos: {
    mood: "cosmos",
    photos: [
      { file: "IMG_9808.jpg", position: "center 38%" },
      { file: "IMG_4084.jpg", position: "center 30%" },
      { file: "IMG_0570.jpg", position: "center 18%" },
      { file: "IMG_9048.jpg", position: "center 14%" },
    ],
  },
  breed: {
    mood: "breed",
    photos: [
      { file: "IMG_0113.jpg", position: "center 68%" },
      { file: "IMG_4132.jpg", position: "center 58%" },
      { file: "IMG_4084.jpg", position: "center 34%" },
      { file: "IMG_4043.jpg", position: "center 48%" },
    ],
  },
  gallery: {
    mood: "gallery",
    photos: [
      { file: "IMG_4173.jpg", position: "center 20%" },
      { file: "IMG_4157.jpg", position: "center 24%" },
      { file: "IMG_3108.jpg", position: "center 30%" },
      { file: "IMG_3888.jpg", position: "center 28%" },
    ],
  },
  records: {
    mood: "records",
    photos: [
      { file: "IMG_4132.jpg", position: "center 52%" },
      { file: "IMG_0570.jpg", position: "center 18%" },
      { file: "IMG_4043.jpg", position: "center 42%" },
      { file: "IMG_9808.jpg", position: "center 36%" },
    ],
  },
};

export function getTabScene(tab) {
  return TAB_SCENES[tab] ?? TAB_SCENES.profile;
}
