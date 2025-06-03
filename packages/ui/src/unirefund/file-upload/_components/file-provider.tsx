"use client";

import {createContext, useContext, useState} from "react";
import {FileFormData, ValidationErrors} from "./form";

interface FileUploaderProviderProps {
  children: JSX.Element;
}
interface FileUploaderState {
  message: string;
  validationErrors?: ValidationErrors;
  data: FileFormData;
}
interface FileUploaderPendingState {
  data: FileFormData;
  progress: number;
}
interface FileUploaderContextProps {
  successed: FileUploaderState[];
  failed: FileUploaderState[];
  pending: FileUploaderPendingState[];
  setPending: (state: FileUploaderPendingState[]) => void;
  setSuccessed: (state: FileUploaderState) => void;
  setFailed: (state: FileUploaderState) => void;
  setProgress: (state: FileUploaderPendingState) => void;
}

const FileUploaderProviderContext = createContext<FileUploaderContextProps>({
  successed: [],
  failed: [],
  pending: [],
  setPending: () => {
    //
  },
  setFailed: () => {
    //
  },
  setSuccessed: () => {
    //
  },
  setProgress: () => {
    //
  },
});

export const useFileUploader = () => {
  return useContext(FileUploaderProviderContext);
};

type States = Omit<FileUploaderContextProps, "setPending" | "setFailed" | "setSuccessed" | "setProgress">;
export function FileUploaderProvider({children}: FileUploaderProviderProps) {
  const [state, setState] = useState<States>({
    failed: [],
    pending: [],
    successed: [],
  });

  const saveProgress = (state: FileUploaderPendingState) => {
    setState((prev) => {
      const data = {
        ...prev,
      };
      let stateIndex = data.pending.findIndex((x) => x.data.file.relativePath === state.data.file.relativePath);
      data.pending[stateIndex] = state;
      return data;
    });
  };

  const savePending = (state: FileUploaderPendingState[]) => {
    setState((prev) => ({
      ...prev,
      pending: state,
    }));
  };

  const saveSuccessed = (state: FileUploaderState) => {
    setState((prev) => ({
      ...prev,
      pending: prev.pending.filter((x) => x.data.file.relativePath !== state.data.file.relativePath),
      successed: [...prev.successed, state],
    }));
  };

  const saveFailed = (state: FileUploaderState) => {
    setState((prev) => ({
      ...prev,
      pending: prev.pending.filter((x) => x.data.file.relativePath !== state.data.file.relativePath),
      failed: [...prev.failed, state],
    }));
  };

  return (
    <FileUploaderProviderContext.Provider
      value={{
        successed: state.successed,
        failed: state.failed,
        pending: state.pending,
        setFailed: saveFailed,
        setPending: savePending,
        setSuccessed: saveSuccessed,
        setProgress: saveProgress,
      }}>
      {children}
    </FileUploaderProviderContext.Provider>
  );
}
