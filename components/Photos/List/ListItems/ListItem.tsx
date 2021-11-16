import React, {ReactText, useEffect, useState} from "react";
import {Data, ItemType, SectionHeader, story} from "../../../../types/interfaces";
import {TouchableHighlight, View, StyleSheet} from "react-native";
import PhotoItem from "./PhotoItem";
import {Media} from "../../../../domian";
import VideoItem from "./VideoItem";
import StoriesItem from "./StoriesItem";
import SectionHeaderItem from "./SectionHeader";
import {MaterialIcons} from "@expo/vector-icons";
import {useRecoilState} from "recoil";
import {SelectedItemsState} from "../../SharedState";

interface Props {
	type: ReactText,
	data: Data
}

const ListItem: React.FC<Props> = (props) => {
	const [selected,setSelected] = useRecoilState(SelectedItemsState)
	const [isSelected,setIsSelected] = useState(false)
	const onLongPress = () => {
		setSelected(currVal => {return {...currVal,...{[props.data.id]:true}}})
	}
	useEffect(()=>{
		if(props.data.id in selected){
			setIsSelected(true);
		}else {
			setIsSelected(false)
		}
	},[selected])

	const onPress = () => {
		if(isSelected)
			setSelected(currVal => {
				let _selecteds = {...currVal}
				delete _selecteds[props.data.id]
				return _selecteds
			})
		if(Object.keys(selected).length>0 && !isSelected){
			setSelected(currVal => {return {...currVal,...{[props.data.id]:true}}})
		}
	}
	
	const getItemByType = (type: React.ReactText, data: Data) => {
		switch (type) {
			case ItemType.Photo: {
				return (<PhotoItem data={data.value as Media}/>)
			}
			case ItemType.Video: {
				return (<VideoItem data={data.value as Media}/>)
			}
			case ItemType.Stories: {
				return (<StoriesItem data={data.value as story[]}/>)
			}
			case ItemType.SectionHeader: {
				return (<SectionHeaderItem data={data.value as SectionHeader} big={false}/>)
			}
			case ItemType.SectionHeaderBig: {
				return (<SectionHeaderItem data={data.value as SectionHeader} big={true}/>)
			}
			default:
				throw Error("Type Not provided")
		}
	}
	const backStyle = {
		flex: 1,
		margin:props.data.id in selected?8:0
	}

	return (
		<View style={{flex:1}}>
			{
				props.type === ItemType.Stories ?
					getItemByType(props.type, props.data) :
					<TouchableHighlight
						style={{flex: 1}}
						onLongPress={onLongPress}
						onPress={onPress}
						underlayColor='#dddddd'>
						<View style={backStyle}>
							{getItemByType(props.type, props.data)}
							<MaterialIcons style={[styles.checkBox,{opacity:props.data.id in selected?1:0}]} name="check" size={25} color="white"/>
						</View>
					</TouchableHighlight>
			}
		</View>

	);

}

const styles = StyleSheet.create({
	checkBox: {
		zIndex: 5,
		height: 20,
		position: 'absolute',
		bottom: 10,
		left: 10,
		flex: 1,
		flexDirection: 'row',
		color: 'white',
	}
})

export default ListItem