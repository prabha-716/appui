import { create } from "zustand";

type PosterStore = {
  posters: string[];
  setPosters: (newPosters: string[]) => void;
};

export const usePosterStore = create<PosterStore>((set) => ({
  posters: [
    'https://www.apple.com/tv-pr/shows-and-films/f/f1/images/show-home-graphic-header/key-art-03/4x1/Apple_TV_F1_key_art_graphic_header_4_1_show_home.jpg',
    'https://images.bauerhosting.com/legacy/empire-tmdb/films/16869/images/bk0GylJLneaSbpQZXpgTwleYigq.jpg?ar=16%3A9&fit=crop&crop=top&auto=format&w=1440&q=80',
    'https://images8.alphacoders.com/121/1217228.jpg',
  ],
  setPosters: (newPosters) => set({ posters: newPosters }),
}));
