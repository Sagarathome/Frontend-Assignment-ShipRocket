import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import BackButtonSvg from "../../assets/backbutton.svg"
import "./Breadcrumb.css"
import { useNavigate, useParams } from "react-router-dom";


const BreadCrumb: React.FC = () => {
    const {id}=useParams()

    const navigate= useNavigate()
    const currentDirectory = useSelector((state: RootState) => state.fileExplorer.currentDirectory);

    return (
        <div className='Breadcumb-container d-flex align-items-center'>
         <button  disabled={!id} onClick={()=>navigate('/')}>   <img src={BackButtonSvg} style={{height:"20px", width:"20px"}} alt="" srcset="" /></button>
            <p className="m-0">{currentDirectory}</p>
        </div>
    );
};

export default BreadCrumb;
