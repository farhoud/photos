import {useRecoilState, useRecoilTransaction_UNSTABLE} from "recoil";
import {mediasState} from "../states";
import {Asset} from "expo-media-library";
import React, {useEffect} from "react";
import * as MediaLibrary from "expo-media-library";
import {MediaRepository} from "../domian/repositories";
import {storagePermission} from "../utils/permissions";

const MediasManager = () => {
	type Action = { type: "insert" | "delete" | "refresh" | "loading", payload: Asset[] }
	const [medias,setMedias]=useRecoilState(mediasState)
	const mediaRepository = new MediaRepository();
	const mediaReducer = (action: Action) => {
		if (action.type === "insert") {
			const insertedMedia = action.payload.map(asset => {
				return {...asset, cid: '', hasCid: false}
			})
			setMedias(currVal => [...currVal, ...insertedMedia])
		}
		if (action.type === "delete") {
			setMedias((currVal => currVal.filter((media) => {
				if (action.payload.find((asset) => asset.id === media.id)) {
					return true
				}
			})))
		}
		if (action.type === "refresh") {
			console.log("refresh called");
			(async () => {
				const data = await mediaRepository.getAll()
				setMedias(data)
				console.log("refresh call end");
				// 
			})()
		}
		if (action.type === "loading") {
			console.log("loading called");
			(async () => {
				const gen = mediaRepository.getIterable()
				while (true){
					const {done,value} = await gen.next()
					if(done){
						console.log("get all done")
						break;
					}
					setMedias((currVal) => [...currVal,...value])
				}				
			})()
		}
	}
	useEffect(() => {
		storagePermission()
			// .then((res) => setPermission(res))
			.catch((error) => {
			});
		MediaLibrary.addListener(event => {
			console.log(event)
			if (event.hasIncrementalChanges) {
				if(event?.insertedAssets.length>0){
					mediaReducer({type:"insert",payload:event.insertedAssets})
				}
				if(event?.deletedAssets.length>0){
					mediaReducer({type:"delete",payload:event.deletedAssets})
				}
			}else {
				mediaReducer({type:"loading",payload:[]})
			}
			
		})
		mediaReducer({type:"loading",payload:[]})
		return () => {MediaLibrary.removeAllListeners()}
	}, [])
	useEffect(()=>{
		console.log("medias changed")
	},[medias])
	return (<></>)
}

export default MediasManager