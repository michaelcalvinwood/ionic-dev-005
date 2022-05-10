import React from "react";

// use interface to create a variable that defines the type of data to be included in the object
export interface Memory {
    id: string;
    imagePath: string;
    title: string;
    type: 'good' | 'bad';
    base64Url: string;
}

const MemoriesContext = React.createContext<{
    // what type of data are we going to share?
    memories: Memory[],
    addMemory: (path: string, base64Data: string, title: string, type: 'good' | 'bad') => void;
    initContext: () => void;
}>({
    // what is the default value of the data we are going to share?
    memories: [],
    addMemory: () => {},
    initContext: () => {}
});

export default MemoriesContext;