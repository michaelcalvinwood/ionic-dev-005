import './NewMemory.scss';

import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { camera } from "ionicons/icons";
import React, { useState, useRef, useContext } from "react";
import { useHistory } from 'react-router-dom';


import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { base64FromPath } from '@ionic/react-hooks/filesystem';

import MemoriesContext from "../data/memories-context"; // import the MemoriesContext object not the provider

const NewMemory: React.FC = () => {

    const [takenPhoto, setTakenPhoto] = useState<{path: string; preview: string}>();
    const [chosenMemoryType, setChosenMemoryType] = useState<'good' | 'bad'>('good');

    const memoriesCtx = useContext(MemoriesContext); // memoriesCtx contains the memories array and the function to add a memory.

    const titleRef = useRef<HTMLIonInputElement>(null);

    const history = useHistory();

    const selectMemoryTypeHandler = (event: CustomEvent) => {
        const selectedMemoryType = event.detail.value;
        setChosenMemoryType(selectedMemoryType);
    }

    const takePhotoHandler = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 80,
            width: 500
        });
        console.log(photo);

        if (!photo || !photo.path || !photo.webPath) {
            return;
        }

        // photo.path contains the path to the photo stored temporarily in the filesystem.
        // photo.webpath is a url style reference that can be used in an img tag

        setTakenPhoto({
            path: photo.path,
            preview: photo.webPath
        })
    }

   const addMemoryHandler = async () => {
        const enteredTitle = titleRef.current?.value;

        if (!enteredTitle || enteredTitle.toString().trim().length === 0 || !takenPhoto || !chosenMemoryType) {
            return;
        }

        const fileName = new Date().getTime() + '.jpeg';
        const base64 = await base64FromPath(takenPhoto!.preview);

        // write the photo to the filesystem
        
        Filesystem.writeFile({
            path: fileName,
            data: base64,
            directory: Directory.Data
        });

        // add the memory to the app context

        memoriesCtx.addMemory(fileName, base64, enteredTitle.toString(), chosenMemoryType);

        // go back to the page that called the modal

        history.length > 0 ?
            history.goBack() :
            history.replace('/good-memories');
   }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref="/good-memories" />
                    </IonButtons>
                    <IonTitle>
                        Add New Memory
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>    
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Memory Title</IonLabel>
                            <IonInput type="text" ref={titleRef}></IonInput>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonSelect onIonChange={selectMemoryTypeHandler} value={chosenMemoryType}>
                            <IonSelectOption value="good">Good Memory</IonSelectOption>
                            <IonSelectOption value="bad">Bad Memory</IonSelectOption>
                        </IonSelect>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-center">
                    <IonCol>
                        <div className="image-preview">
                            {!takenPhoto && <h3>No photo chosen</h3>}
                            {takenPhoto && <img src={takenPhoto.preview} alt="preview"/>}
                        </div>
                        <IonButton fill="clear" onClick={takePhotoHandler}>
                            <IonIcon icon={camera} slot="start"/>
                            <IonLabel>Take Photo</IonLabel>
                        </IonButton>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-margin-top">
                    <IonCol className="ion-text-center">
                        <IonButton onClick={addMemoryHandler}>Add Memory</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default NewMemory;