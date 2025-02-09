import React from 'react';
import './Sidebar.css';

import {setCurrentDirectory} from '../../redux/fileExplorerSlice'

import Desktop from "../../assets/desktop.svg";
import Document from "../../assets/document.svg";
import Download from "../../assets/download.svg";
import { useDispatch } from 'react-redux';

const buttonData = [
  { name: "Desktop", icon: Desktop },
  { name: "Document", icon: Document },
  { name: "Download", icon: Download }
];

const Sidebar: React.FC = () => {
  const dispatch = useDispatch()

  const handleButtonClick = (name: string) => {
    dispatch(setCurrentDirectory(name)); 
  };

  return (
    <div className='side-bar-container'>
      {buttonData.map((item, index) => (
        <button key={index} onClick={()=>handleButtonClick(item.name)}>
          <img src={item.icon} alt={item.name} style={{ height: "20px", width: "20px" }} /> {item.name}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
