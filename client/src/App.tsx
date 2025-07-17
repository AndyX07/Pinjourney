import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import 'leaflet/dist/leaflet.css';
import Navbar from './components/Navbar/Navbar';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Trips from './pages/Trips/Trips';
import AddTrip from './pages/AddTrip/AddTrip';
import TripDetail from './pages/TripDetail/TripDetail';
import EditTrip from './pages/EditTrip/EditTrip';
import LocationDetails from './pages/LocationDetails/LocationDetails';
import AddLocation from './pages/AddLocation/AddLocation';
import EditLocation from './pages/EditLocation/EditLocation';
import TripMapView from './pages/TripMapView/TripMapView';
import AllLocationMap from './pages/AllLocationMap/AllLocationMap';
import Recommendation from './pages/Recommendation/Recommendation';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/trips' element={<Trips/>}/>
        <Route path='/add-trip' element={<AddTrip/>}/>
        <Route path='/trips/:id' element={<TripDetail/>}/>
        <Route path='/trips/:id/edit' element={<EditTrip/>}/>
        <Route path ='/trips/:id/map-view' element={<TripMapView/>}/>
        <Route path='/trips/:id/locations/:locationId' element={<LocationDetails/>}/>
        <Route path='/trips/:id/add-location' element={<AddLocation/>}/>
        <Route path='/trips/:id/locations/:locationId/edit' element={<EditLocation/>}/>
        <Route path='/map' element={<AllLocationMap/>}/>
        <Route path="/recommendation" element={<Recommendation/>}/>
      </Routes>
    </Router>
  );
}

export default App;