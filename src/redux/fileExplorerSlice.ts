import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Folder {
    id: number;
    name: string;
    parentId: number | null;
    children: Folder[];
    position: { x: number, y: number }
}

interface FileExplorerState {
    currentDirectory: string;
    folders: Folder[];
    active: Folder | null;
    folderWithId: any;
}

interface RenamePayload {
    id: number,
    newName: string
}

interface PositionPayload {
    id: number,
    newPosition: { x: number, y: number }
    parentId: number | null
}

interface MergeIdPayLoad {
    sourceId: number,
    targetId: number
}

const initialState: FileExplorerState = {
    currentDirectory: 'Desktop',
    folders: [],
    active: null,
    folderWithId: null
}

const findFolderById = (folders: Folder[], id: number): Folder | null => {
    for (const folder of folders) {
        if (folder.id === id) return folder;
        if (folder.children.length > 0) {
            const found = findFolderById(folder.children, id);
            if (found) return found;
        }
    }
    return null;
};

const FileExplorerSlice = createSlice({
    name: 'fileExplorer',
    initialState,
    reducers: {

        setCurrentDirectory(state, action: PayloadAction<string>) {
            state.currentDirectory = action.payload;
        },

        createFolder: (state, action: PayloadAction<{ name: string; parentId: number | null; position: { x: number; y: number } }>) => {
            let newName = action.payload.name;
            let count = 1;

            const isNameUnique = (folders: Folder[], parentId: number | null, name: string): boolean => {
                for (const folder of folders) {
                    if (folder.parentId === parentId && folder.name === name) {
                        return false;
                    }
                    if (folder.children.length > 0) {
                        if (!isNameUnique(folder.children, parentId, name)) {
                            return false;
                        }
                    }
                }
                return true;
            };

            while (!isNameUnique(state.folders, action.payload.parentId, newName)) {
                newName = `${action.payload.name} (${count})`;
                count++;
            }

            const newFolder: Folder = {
                id: Date.now(),
                name: newName,
                parentId: action.payload.parentId,
                children: [],
                position: action.payload.position
            };

            if (action.payload.parentId === null) {
                state.folders.push(newFolder);
            } else {
                const parentFolder = findFolderById(state.folders, action.payload.parentId);
                if (parentFolder) {
                    parentFolder.children.push(newFolder);
                }
            }
        },

        activeFolder: (state, { payload }) => {
            state.active = payload;
        },

        deleteFolder: (state, action: PayloadAction<number>) => {
            state.folders = state.folders.filter((item) => item.id !== action.payload);
        },

        renameFolder: (state, action: PayloadAction<RenamePayload>) => {
            const { id, newName } = action.payload;
            const renameFolder = state.folders.find((item) => item.id === id);
            if (renameFolder) {
                renameFolder.name = newName;
            }
        },

        updateFolderPosition: (state, action: PayloadAction<PositionPayload>) => {
            const { id, newPosition, parentId } = action.payload;

            state.folders = state.folders.map((folder) => {
                if (folder.id === id) {
                    return {
                        ...folder,
                        position: newPosition
                    };
                }
                return folder;
            });
        },

        getFolderData: (state, action: PayloadAction<number>) => {
            const folderId = action.payload;
            const folder = findFolderById(state.folders, folderId);
            if (folder) {
                state.folderWithId = folder;
            }
        },

        mergeFolder: (state, action: PayloadAction<MergeIdPayLoad>) => {
            const { sourceId, targetId } = action.payload;

            const targetFolder = findFolderById(state.folders, targetId);
            const sourceFolder = findFolderById(state.folders, sourceId);

            if (targetFolder && sourceFolder) {
                state.folders = state.folders.filter(folder => folder.id !== sourceId);
                sourceFolder.parentId = targetFolder.id;
                targetFolder.children.push(sourceFolder);
            } else {
                console.log("Either target or source folder not found");
            }
        }
    }
});

export const { setCurrentDirectory, createFolder, activeFolder, deleteFolder, renameFolder, updateFolderPosition, getFolderData, mergeFolder } = FileExplorerSlice.actions;

export default FileExplorerSlice.reducer;
