import React from "react";


export default function Loading(props) {
  switch(props.size){
      case 'sm':
          return <div className="dot-windmill" style={{width: '10px', height:'10px'}} />
          break;
      case 'md':
          return <div className="dot-windmill" style={{width: '20px', height:'20px'}} />
          break;
      case 'lg':
          return <div className="dot-windmill" style={{width: '30px', height:'30px'}} />
          break;
      default:
          return <div className="dot-windmill" />
          break;            
  }  
}
