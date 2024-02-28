import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonContent, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
import { AuthProvider, Login, PrivateRoute } from './core';
import MainLayout from './pages/MainLayout';
import ListsExplorer from './pages/myLists/ListsExplorer';
import ListContent from './pages/tasksList/ListContent';
import Home from './pages/home/Home';
import { TasksProvider } from './core/providers/TasksProvider';
import { ListsProvider } from './core/providers/ListsProvider';
import { ListWithTasksProvider } from './core/providers/ListWithTasksProvider';
import OverdueTasks from './pages/overdueTasks/OverdueTasks';
import { Register } from './pages/register/Register';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <AuthProvider>
          <Route component={Login} path="/login" exact={true}/>
          <Route component={Register} path="/register" exact={true}/>
          <MainLayout>
            <ListsProvider>
              <TasksProvider>
                <ListWithTasksProvider>
                  <PrivateRoute component={Home} path='/home' exact={true}></PrivateRoute>
                  <PrivateRoute component={ListsExplorer} path='/my-lists' exact={true}></PrivateRoute>
                  <PrivateRoute component={ListContent} path='/list/:id' exact={true}></PrivateRoute>
                  <PrivateRoute component={OverdueTasks} path='/overdue-tasks' exact={true}></PrivateRoute>
                  <Route exact path="/" render={() => <Redirect to="/home"/>}/>
                </ListWithTasksProvider>
              </TasksProvider>
            </ListsProvider>
          </MainLayout>
        </AuthProvider>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
