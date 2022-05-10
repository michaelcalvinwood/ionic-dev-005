import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router';

/* Import the Pages */
import GoodMemories from './pages/GoodMemories';
import BadMemories from './pages/BadMemories';
import NewMemory from './pages/NewMemory';

/* Import icons for the tabs */
import { happy, sad } from 'ionicons/icons';

/* Import the data that's going to be shared amongst the components */
import { useContext, useEffect } from 'react';
import MemoriesContext from './data/memories-context';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/theme.css';
import { initialize } from '@ionic/core';

setupIonicReact();

/* Setup Routes to the Pages */

const App: React.FC = () => {
  const memoriesCtx = useContext(MemoriesContext);
  const { initContext } = memoriesCtx;

  useEffect(() => {
    initContext();
  }, [initContext]);
  
  return (
    <IonApp>
      <IonReactRouter>
          <IonTabs>
              <IonRouterOutlet>
                <Route path="/good-memories">
                  <GoodMemories />
                </Route>
                <Route path="/bad-memories">
                  <BadMemories />
                </Route>
                <Route path="/new-memory">
                  <NewMemory />
                </Route>
                <Redirect to="/good-memories" />
              </IonRouterOutlet>
            <IonTabBar slot='bottom'>
              {/* Note: The tab prop in IonTabButton is just an identifier. Choose anything you like. */}
              <IonTabButton href="/good-memories" tab="good"> 
                <IonIcon icon={happy} />
                <IonLabel>Good Memories</IonLabel>
              </IonTabButton>
              <IonTabButton href="/bad-memories" tab="bad">
                <IonIcon icon={sad} />
                <IonLabel>Sad Memories</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
  }
export default App;
