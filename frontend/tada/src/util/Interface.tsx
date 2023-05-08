export interface TreasureInfo {
	id: number;
	imgPath: string;
	lat: string;
	lng: string;
	hint: string;
	rewardImgPath: string;
	reward: string;
	status: boolean;
	finderNick : string | null;
}

export interface LocationData {
  latitude : number
  longitude : number
}

export interface WatchLocation {
  data: LocationData | null
  error: string | null
  getCurrentLocation: () => void
}
