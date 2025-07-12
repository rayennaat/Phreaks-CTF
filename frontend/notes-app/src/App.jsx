import React from 'react'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home/Home'
import Login from './pages/Login/Login';
import Hero from './pages/Hero/Hero';
import Teams from './pages/Teams/Teams';
import Users from './pages/Users/users';
import Scoreboard from './pages/Scoreboard/Scoreboard';
import Team from './pages/Profiles/Team';
import FuzzyOverlayExample from './pages/Challenges/Challenges';
import ProfileUser from './pages/Profiles/User';
import Register from './pages/Login/Register';
import ChatComponent from './components/Chat/Chat';
import AdminTeamsTable from './pages/Admin/AdminTeamsTable';
import AdminUsersTable from './pages/Admin/AdminUsersTable';
import AdminChallenges from './pages/Admin/AdminChallennges';
import AdminSubmissions from './pages/Admin/AdminSubmissions';
import AdminScoreboard from './pages/Admin/AdminScoreboard';
import AdminStatics from './pages/Admin/AdminStatics';
import AdminConfig from './pages/Admin/AdminConfig';
import Writeups from './pages/Writeups/writeups';
import CreateWriteup from './pages/Writeup/CreateWriteup';
import WriteupDetails from './pages/Writeups/WriteupDetails';
import AdminWriteups from './pages/Admin/AdminWriteups';
import Notifications from './pages/Notifications/Notifications';
import AdminNotifications from './pages/Admin/AdminNotifications';



const routes= (
  <Router>
    <Routes>
      <Route path='/' exact element={<Hero />} />
      <Route path='/home' exact element={<Home />} />
      <Route path='/login' exact element={<Login />} />
      <Route path='/challenges' exact element={<FuzzyOverlayExample />} />
      <Route path='/teams' exact element={<Teams/>} />
      <Route path='/users' exact element={<Users />} />
      <Route path='/notifications' exact element={<Notifications />} />
      <Route path='/scoreboard' exact element={<Scoreboard    />} />
      <Route path='/team' exact element={<Team    />} />
      <Route path='/profileuser' exact element={<ProfileUser    />} />
      <Route path='/signup' exact element={<Register/>} />
      <Route path='/chat' exact element={<ChatComponent/>} />
      <Route path='/admin/statics' exact element={<AdminStatics/>} />
      <Route path='/admin/teams' exact element={<AdminTeamsTable/>} />
      <Route path='/admin/users' exact element={<AdminUsersTable/>} />
      <Route path='/admin/challenges' exact element={<AdminChallenges/>} />
      <Route path='/admin/submissions' exact element={<AdminSubmissions/>} />
      <Route path='/admin/scoreboard' exact element={<AdminScoreboard/>} />
      <Route path='/admin/config' exact element={<AdminConfig/>} />
      <Route path='/admin/notifications' exact element={<AdminNotifications/>} />
      <Route path='/admin/writeups' exact element={<AdminWriteups/>} />
      <Route path='/writeups' exact element={<Writeups/>} />
      <Route path='/create-writeups' exact element={<CreateWriteup/>} />
      <Route path='/writeups/:id' exact element={<WriteupDetails/>} />
    </Routes>
  </Router>
);

const App = () => {
  return <div> {routes} </div> ;
    
  
}

export default App
