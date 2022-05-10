import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar, isPlatform } from "@ionic/react";
import React, { useContext } from "react";

import { add } from 'ionicons/icons';

import MemoriesContext from "../data/memories-context";
import MemoryItem from "../components/MemoryItem";
import MemoriesList from "../components/MemoriesList";

const GoodMemories: React.FC = () => {
    const memoriesCtx = useContext(MemoriesContext);
    const goodMemories = memoriesCtx.memories.filter(memory => memory.type === 'good');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Good Memories
                    </IonTitle>
                    {isPlatform('ios') && (
                        <IonButtons slot="end">
                            <IonButton routerLink="/new-memory">
                                <IonIcon slot="icon-only" icon={add} />
                            </IonButton>
                        </IonButtons>
                    )}
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {goodMemories.length === 0 && (
                    <IonRow>
                        <IonCol className="ion-text-center">
                            <h2>No good memories found.</h2>
                        </IonCol>
                    </IonRow>
                )}
                <MemoriesList items={goodMemories} />
                {!isPlatform('ios') && (
                    // props horizontal and vertical define where the fab goes and fixed keeps in place so it does not scroll
                    <IonFab horizontal="end" vertical="bottom" slot="fixed">
                        <IonFabButton routerLink="/new-memory">
                            <IonIcon icon={add} />
                        </IonFabButton>
                    </IonFab>
                )}
            </IonContent>
        </IonPage>
    )
}

export default GoodMemories;