import React from "react";
import RNFS from 'react-native-fs';

export const Nenfile= async(base64content)=>{
  let listThanhPhanHoSoHtml = ``;
  for (let i = 0; i < base64content.length; i++) {
    let base64=await RNFS.readFile(base64content[i].uri,'base64');
            if(base64content[i].type==='application/pdf')
            {
              listThanhPhanHoSoHtml += `<iframe src="${base64content[i].uri}" width="100%" height="600px"></iframe>`;
            }else{
              listThanhPhanHoSoHtml += `<div><img src="data:${base64content[i].type};base64,${base64}" width=300px height=400px/></div>`
            }
  }
  return listThanhPhanHoSoHtml;
}


