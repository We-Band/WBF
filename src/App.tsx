import { BrowserRouter, Route, Routes } from 'react-router';
import LiteLayout from '@layout/lite/LiteLayout';
import MainLayout from '@layout/main/MainLayout';
import Home from '@pages/Home';
import Lite from '@pages/Lite';
import * as S from './App.styled';
import Alert from '@components/alert/Alert';

import useAlertStore, { AlertStore } from '@store/alert';

function App() {
  const alert = useAlertStore((state) => state.alert);
  const alertMessage = useAlertStore((state) => state.alertMessage);
  const setAlert = useAlertStore((state) => state.setAlert);

  return (
    <S.AppContainer>
      <BrowserRouter>
        {alert && (
          <Alert messages={alertMessage} onClose={() => setAlert(false)} />
        )}
        <Routes>
          <Route element={<LiteLayout />}>
            <Route path="lite" element={<Lite />} />
            <Route path="lite/:teamId" element={<Lite />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </S.AppContainer>
  );
}

export default App;
