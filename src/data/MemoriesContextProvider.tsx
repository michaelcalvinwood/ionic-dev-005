import React, { useState, useEffect, useCallback } from "react";
import MemoriesContext, { Memory } from "./memories-context";
import { Storage } from '@capacitor/storage';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { base64FromPath } from '@ionic/react-hooks/filesystem';

const MemoriesContextProvider: React.FC = props => {
    // define what we want to share with the components
    const [memories, setMemories] = useState<Memory[]>([]);

    useEffect(() => {
        // add memory to device storage once the context has asynchronously added a new memory

        // strip the base64 image from memories to save on storage space
        const storableMemories = memories.map(memory => {
            return {
                id: memory.id,
                title: memory.title,
                imagePath: memory.imagePath,
                type: memory.type
            }
        })
        Storage.set({
            key: 'memories',
            value: JSON.stringify(storableMemories)
        })
    }, [memories]);

    const addMemory = (path: string, base64Data: string, title: string, type: 'good' | 'bad') => {
        const newMemory: Memory = {
            id: Math.random().toString(),
            title,
            type,
            imagePath: path,
            base64Url: base64Data
        }

        // add memory to app context

        setMemories(curMemories => {
            return [...curMemories, newMemory];
        })
    };

    // wrap initContext in useCallback with [] dependency so that this function is never regenerated when the Provider changes. I.e. make it static (created only once)
    // this way we can use initContext as a useEffect dependency in the App component to ensure that it is run only once (as initiContext will never change)

    const initContext = useCallback( async () => {
        const memoriesData = await Storage.get({key: 'memories'});
        const storedMemories = memoriesData.value ?
            JSON.parse(memoriesData.value) :
            [];

        const loadedMemories: Memory[] = [];
        for (const storedMemory of storedMemories) {
            const file = await Filesystem.readFile({
                path: storedMemory.imagePath,
                directory: Directory.Data
            })

            loadedMemories.push({
                id: storedMemory.id,
                title: storedMemory.title,
                type: storedMemory.type,
                imagePath: storedMemory.imagePath,
                base64Url: 'data:image/jpeg;base64,' + file.data
            })
        }
        
        setMemories(loadedMemories);
    }, []);

    // return the Provider with the value set to that which we want to share
    return (
        <MemoriesContext.Provider
            value = {{
                memories,
                addMemory,
                initContext
            }}>
            {props.children}
        </MemoriesContext.Provider>
    )
}

export default MemoriesContextProvider;