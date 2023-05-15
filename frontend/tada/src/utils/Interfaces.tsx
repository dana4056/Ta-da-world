export interface TreasureInfo {
	id: number;
	imgPath: string;
	lat: string;
	lng: string;
	hint: string;
	rewardImgPath: string;
	reward: string;
	status: boolean;
	finderNick: string | null;
}

export interface LocationData {
  latitude: number
  longitude: number
}

export interface CurrentLocation {
  data: LocationData | null
  error: string | null
  getCurrentLocation: () => void
}

export interface UserListItem {
	id: string;
	nick: string;
	imgNo: number;
}
