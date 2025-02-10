import React, { useEffect, useState } from 'react';
import "./FileList.css";
import ContextMenu from '../ContextMenu/ContextMenu';
import { useDispatch, useSelector } from 'react-redux';
import FolderSvg from "../../assets/folderImg.svg";
import { activeFolder, renameFolder, updateFolderPosition, getFolderData, mergeFolder } from "../../redux/fileExplorerSlice";
import { useNavigate, useParams } from 'react-router-dom';
import BreadCrumb from '../BreadCrumb/Breadcrumb';

interface Position {
  x: number;
  y: number;
}

interface SelectedFolder {
  id: number;
  name: string;
  parentId: number | null;
  position: { x: number, y: number };
}

const FileList: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState<Boolean>(false);
  const [isRename, setIsRename] = useState<Boolean>(false);
  const [draggedFolder, setDraggedFolder] = useState<SelectedFolder | null>(null);


  const folders = useSelector((state: { fileExplorer: { folders: any[] } }) => state.fileExplorer.folders);
  const activeFolderState = useSelector((state: { fileExplorer: { active: SelectedFolder } }) => state.fileExplorer.active);
  const insideFolder = useSelector((state: { fileExplorer: { folderWithId: SelectedFolder } }) => state.fileExplorer.folderWithId);

  const { id: folderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    if (folderId) {
      dispatch(getFolderData(folderId));
    }
  }, [folderId]);

  const clickOutSideHandler = () => {
    setIsVisible(false);
    setIsRename(false);
    dispatch(activeFolder(null));
  };

  const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    const { clientX: x, clientY: y } = e;
    setPosition({ x, y });
    setIsVisible(true);
  };

  const clickOnFolderHandler = (e: React.MouseEvent<HTMLDivElement>, folder: SelectedFolder): void => {
    e.preventDefault();
    dispatch(activeFolder(folder));
  };

  const activeHandler = (folder: SelectedFolder) => {
    dispatch(activeFolder(folder));
  };

  const renameHandler = (e: any) => {
    const { value } = e.target;
    dispatch(renameFolder({ id: activeFolderState?.id, newName: value }));
  };

  const drag_start = (e: React.DragEvent<HTMLDivElement>, folder: SelectedFolder) => {
    dispatch(activeFolder(folder));
    setDraggedFolder(folder);
    const offsetX = e.clientX - folder.position.x;
    const offsetY = e.clientY - folder.position.y;

    e.dataTransfer.setData("text/plain", JSON.stringify({
      folderId: folder.id,
      offsetX,
      offsetY
    }));
  };

  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const targetFolderElement = target.closest('[data-folder-id]');

    if (targetFolderElement && draggedFolder) {
      const targetFolderId = parseInt(targetFolderElement.getAttribute('data-folder-id') || '0', 10);

      if (draggedFolder.id !== targetFolderId) {
        dispatch(mergeFolder({
          sourceId: draggedFolder.id,
          targetId: targetFolderId
        }));
      } else {
        const dropX = e.clientX;
        const dropY = e.clientY;

        dispatch(updateFolderPosition({
          id: draggedFolder.id,
          newPosition: { x: dropX, y: dropY },
          parentId: draggedFolder?.parentId
        }));
      }
    } else {
      const dropX = e.clientX;
      const dropY = e.clientY;

      if (draggedFolder) {
        dispatch(updateFolderPosition({
          id: draggedFolder.id,
          newPosition: { x: dropX, y: dropY },
          parentId: draggedFolder?.parentId
        }));
      }
    }
    setDraggedFolder(null);
  };

  const drag_over = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    return false;
  };

  const dragEnterHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const folderElement = target.closest('[data-folder-id]');

    if (folderElement) {
      folderElement.classList.add('drag-over');
    }
  };

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const folderElement = target.closest('[data-folder-id]');

    if (folderElement) {
      folderElement.classList.remove('drag-over');
    }
  };

  const doubleClickHandler = (folder: SelectedFolder) => {
    navigate(`/${folder?.id}`);
    dispatch(getFolderData(folder?.id));
  };

  useEffect(() => {
    if (folderId) {
      dispatch(getFolderData(folderId));
    }
  }, [folders, folderId]);

  const Data = folderId ? insideFolder?.children || [] : folders || [];

  const mapFolder = (folders: any) => {
    return folders.map((item) => {
      return <div key={item.id}
        data-folder-id={item.id}
        className='d-flex flex-column'
        style={{ position: "absolute", top: item?.position?.y - 20, left: item?.position?.x - 200 }}
        draggable={true}
        onDragStart={(e) => drag_start(e, item)}
        onDragEnter={dragEnterHandler}
        onDragLeave={dragLeaveHandler}
        onContextMenu={(e) => clickOnFolderHandler(e, item)}
        onClick={() => activeHandler(item)}
        onDoubleClick={() => doubleClickHandler(item)}
      >
        <img src={FolderSvg} alt="folder" className={`${activeFolderState ? "active-background" : ""}`} />
        {isRename && item?.id === activeFolderState?.id ?  <input type="text" autoFocus className='rename-input' onChange={renameHandler} />
        :<span className={`${activeFolderState ? "active-text-background" : " "} m-0 text-white text-center folder-font-style`}  >{item?.name}</span> 
         
        }
      </div>;
    });
  };

  return (
    <>
        <div className='file-list-container position-relative' onDragOver={(e) => drag_over(e)} onDrop={(e) => drop(e)} onClick={clickOutSideHandler} onContextMenu={handleRightClick}>
        <BreadCrumb />
        {Data.length === 0 ? (
          <div className='d-flex justify-content-center h-100 align-items-center no-found-color'> <h2>No Folder Found. Use Right Click to Create a New Folder</h2></div>
        ) : (
          mapFolder(Data)
        )}
      </div>
      {isVisible && <ContextMenu position={position} setIsVisible={setIsVisible} setIsRename={setIsRename} />}
    </>
  );
};

export default FileList;
