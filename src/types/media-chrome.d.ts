declare module "media-chrome/react" {
  import { ComponentType, HTMLAttributes } from "react";

  type MediaChromeProps = HTMLAttributes<HTMLElement> & {
    [key: string]: any;
  };

  export const MediaController: ComponentType<
    MediaChromeProps & { audio?: boolean }
  >;
  export const MediaControlBar: ComponentType<MediaChromeProps>;
  export const MediaTimeRange: ComponentType<MediaChromeProps>;
  export const MediaTimeDisplay: ComponentType<
    MediaChromeProps & { showDuration?: boolean }
  >;
  export const MediaVolumeRange: ComponentType<MediaChromeProps>;
  export const MediaPlaybackRateButton: ComponentType<MediaChromeProps>;
  export const MediaPlayButton: ComponentType<MediaChromeProps>;
  export const MediaSeekBackwardButton: ComponentType<MediaChromeProps>;
  export const MediaSeekForwardButton: ComponentType<MediaChromeProps>;
  export const MediaMuteButton: ComponentType<MediaChromeProps>;
  export const MediaLoopButton: ComponentType<MediaChromeProps>;
  export const MediaDurationDisplay: ComponentType<MediaChromeProps>;
  export const MediaFullscreenButton: ComponentType<MediaChromeProps>;
}

declare module "media-chrome/react/media-store" {
  import { ComponentType, ReactNode } from "react";

  export interface MediaState {
    mediaPaused: boolean;
    mediaLoading: boolean;
    mediaCurrentTime: number;
    mediaDuration: number;
    mediaMuted: boolean;
    mediaVolume: number;
    mediaEnded: boolean;
    mediaHasPlayed: boolean;
    mediaIsFullscreen: boolean;
    mediaPlaybackRate: number;
    [key: string]: any;
  }

  export const MediaProvider: ComponentType<{ children: ReactNode }>;
  export const useMediaRef: () => (
    el: HTMLMediaElement | null | undefined,
  ) => void;
  export const useMediaSelector: <S = any>(
    selector: (state: MediaState) => S,
    equalityFn?: (a: any, b: any) => boolean,
  ) => S;
  export const useMediaDispatch: () => (action: {
    type: string;
    detail?: any;
  }) => void;
  export const useMediaFullscreenRef: () => (
    el: HTMLElement | null | undefined,
  ) => void;
  export const MediaActionTypes: Record<string, string>;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}
