import {Media} from "../../domian";
import {MediaTypeValue} from "expo-media-library";
import {Data, ItemType, SectionType, story} from "../../types/interfaces";

export function dataMapper(medias: Media[], sectionType: SectionType): Data[] {
	let result: Data[] = [];
	let LastBig = null;
	medias.forEach((media, index, all) => {
		switch (index) {
			case 0: {
				const stories = storyMapper(medias)
				stories.length > 0 && result.push({
					id: "Stories",
					type: ItemType.Stories,
					value: stories
				})
				break;
			}
			case 1: {
				const currTimeStamp = new Date(media.creationTime)
				result.push({
					id: media.creationTime.toString(),
					type: isBig(currTimeStamp) ? ItemType.SectionHeaderBig : ItemType.SectionHeader,
					value: {timeStamp: currTimeStamp}
				})
				result.push({
					id: media.id,
					type: ItemTypeFromMediaType(media.mediaType),
					value: media
				})
				break;
			}
			default : {
				const lastTimeStamp = new Date(all[index - 1].creationTime)
				const currTimeStamp = new Date(media.creationTime)
				if (!getDiffFunc(SectionType.Day)(lastTimeStamp, currTimeStamp)) {
					result.push({
						id: media.creationTime.toString(),
						type: !getDiffFunc(SectionType.Month)(lastTimeStamp, currTimeStamp) ? ItemType.SectionHeaderBig : ItemType.SectionHeader,
						value: {timeStamp: currTimeStamp}
					})
				}
				result.push({
					id: media.id,
					type: ItemTypeFromMediaType(media.mediaType),
					value: media
				})
			}
		}


	})
	return result;
}

export function storyMapper(medias:Media[]) {
	let stories: story[] = [];
	
	let counter1: { [key: number]: number } = {};
	let counter2: { [key: number]: number } = {};
	let counter3: { [key: number]: number } = {};
	let highlightedMedia: { [key: string]: boolean } = {};

	for (let i = 0; i < medias.length; i++) {
		let yearStart = {'day': '', 'month': ''};

		//Creating stories
		let now = new Date();
		now.setHours(0, 0, 0, 0);

		let media = new Date(medias[i].modificationTime);
		media.setHours(0, 0, 0, 0);

		//Current photos in the same year
		if ((now.getDate() === media.getDate()) && now.getFullYear() === media.getFullYear()) {
			if (!counter1[media.getMonth()]) {
				counter1[media.getMonth()] = 0;
			}
			counter1[media.getMonth()] = counter1[media.getMonth()] + 1;
			if (!stories[0] || !stories[0].medias) {
				stories[0] = {medias: [], text: 'Recent'};
			}
			if (counter1[media.getMonth()] <= 2 && !highlightedMedia[medias[i].id]) {
				stories[0].medias.push(medias[i]);
				highlightedMedia[medias[i].id] = true;
			}
		}

		//Current photos in the past years
		if (now.getDate() === media.getDate() && now.getMonth() === media.getMonth() && now.getFullYear() !== media.getFullYear()) {
			let difference = now.getFullYear() - media.getFullYear();
			if (!counter2[difference]) {
				counter2[difference] = 0;
			}
			counter2[difference] = counter2[difference] + 1;

			if (!stories[difference] || !stories[difference].medias) {
				stories[difference] = {
					medias: [],
					text: difference + ' ' + (difference === 1 ? 'year' : 'years') + ' ago'
				};
			}
			if (counter2[difference] <= 6 && !highlightedMedia[medias[i].id]) {
				stories[difference].medias.push(medias[i]);
				highlightedMedia[medias[i].id] = true;
			}
		}

		//Current photos in the past months-->This is temporary for demo
		if (now.getDate() === media.getDate() && now.getMonth() !== media.getMonth() && now.getFullYear() === media.getFullYear()) {
			let difference = now.getMonth() - media.getMonth();
			if (difference < 0) {
				difference = 12 + difference;
			}
			if (!counter3[difference]) {
				counter3[difference] = 0;
			}
			counter3[difference] = counter3[difference] + 1;

			if (!stories[difference] || !stories[difference].medias) {
				stories[difference] = {
					medias: [],
					text: difference + ' ' + (difference === 1 ? 'month' : 'months') + ' ago'
				};
			}
			if (counter3[difference] <= 6 && !highlightedMedia[medias[i].id]) {
				stories[difference].medias.push(medias[i]);
				highlightedMedia[medias[i].id] = true;
			}
		}

	}
	return  stories.filter(x => x?.medias[0]?.uri);
}

export function getDiffFunc(sectionType: SectionType) {
	switch (sectionType) {
		case SectionType.Day:
			return (lastTimeStamp: Date, currTimeStamp: Date) => {
				return lastTimeStamp.getDate() === currTimeStamp.getDate();
			}
		case SectionType.Month:
			return (lastTimeStamp: Date, currTimeStamp: Date) => {
				return lastTimeStamp.getMonth() === currTimeStamp.getMonth();
			}
		case SectionType.Year:
			return (lastTimeStamp: Date, currTimeStamp: Date) => {
				return lastTimeStamp.getFullYear() === currTimeStamp.getFullYear();
			}
	}
}

function isBig(timeStamp: Date) {
	const now = new Date()
	const showYear = !getDiffFunc(SectionType.Year)(now, timeStamp)
	const showMonth = !getDiffFunc(SectionType.Month)(now, timeStamp)
	return showMonth || showYear
}

export function ItemTypeFromMediaType(mediaType:MediaTypeValue){
	switch (mediaType){
		case "photo":
			return ItemType.Photo
		case "video":
			return ItemType.Video
		default:
			throw Error("Dont Support this type")
	}
}


