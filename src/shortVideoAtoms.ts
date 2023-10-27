import { atom } from "jotai";

type ShortVideoState = {
  currentTime: number;
  jumpToTime: number | null;
  duration: number;
  isPaused: boolean;
};

type ShortVideoAction =
  | {
      type: "PAUSE" | "PLAY" | "RESET_JUMP_TIME";
    }
  | {
      type: "JUMP_TO";
      payload: {
        jumpToTime: number;
      };
    }
  | {
      type: "TIME_UPDATE";
      payload: {
        currentTime: number;
      };
    }
  | {
      type: "INIT";
      payload: {
        currentTime: number;
        duration: number;
      };
    };

const DEFAULT_STATE = {
  currentTime: 0,
  jumpToTime: null,
  duration: 0,
  isPaused: true,
};

export const shortVideoAtom = atom<ShortVideoState>(DEFAULT_STATE);
export const shortVideoDispatchAtom = atom(
  null,
  (get, set, action: ShortVideoAction) => {
    set(shortVideoAtom, shortVideoReducer(get(shortVideoAtom), action));
  }
);

const shortVideoReducer = (
  state: ShortVideoState,
  action: ShortVideoAction
): ShortVideoState => {
  switch (action.type) {
    case "TIME_UPDATE": {
      return {
        ...state,
        currentTime: action.payload.currentTime,
      };
    }
    case "JUMP_TO": {
      return {
        ...state,
        jumpToTime: action.payload.jumpToTime,
      };
    }
    case "RESET_JUMP_TIME": {
      return {
        ...state,
        jumpToTime: null,
      };
    }
    case "PLAY": {
      return {
        ...state,
        isPaused: false,
      };
    }
    case "PAUSE": {
      return {
        ...state,
        isPaused: true,
      };
    }
    case "INIT": {
      return {
        ...state,
        currentTime: action.payload.currentTime,
        duration: action.payload.duration,
      };
    }
    default: {
      return state;
    }
  }
};