import React from "react";
import "./ContextMenu.css";
import { useDispatch, useSelector } from "react-redux";
import { createFolder, deleteFolder, activeFolder, getFolderData } from "../../redux/fileExplorerSlice";
import { useParams } from "react-router-dom";

interface Position {
  x: number;
  y: number;
}

interface ContextMenuProps {
  position: Position;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRename: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ position, setIsVisible, setIsRename }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const folder = useSelector((state: { fileExplorer: { active: any } }) => state.fileExplorer.active);
  const insideFolder = useSelector((state: { fileExplorer: { folderWithId: { id: number } | null } }) =>
    state.fileExplorer.folderWithId
  );

  const newFolderHandler = (position: Position) => {
    const newFolder = {
      name: "New Folder",
      parentId: insideFolder ? insideFolder.id : null,
      position: position
    };
    dispatch(createFolder(newFolder));
    insideFolder && dispatch(getFolderData(insideFolder?.id));
    setIsVisible(false);
  };

  const deleteHandler = () => {
    setIsVisible(false);
    dispatch(deleteFolder(folder.id));
    dispatch(activeFolder(null));
  };

  const renameStateHandler = () => {
    setIsRename(true);
    setIsVisible(false);
  };

  return (
    <div style={{ position: "absolute", top: position.y, left: position.x }}>
      <div className="contextMenu-div">
        {!folder && <p className="contextMenu-item" onClick={() => newFolderHandler(position)}>New Folder</p>}
        {folder && <p className="contextMenu-item" onClick={renameStateHandler}>Rename Folder</p>}
        {folder && <p className="contextMenu-item contextMenu-item-danger" onClick={deleteHandler}>Delete Folder</p>}
      </div>
    </div>
  );
};

export default ContextMenu;
