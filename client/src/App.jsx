import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ListHeader from "./components/ListHeader";
import ListItem from './components/ListItem';
import Auth from "./components/Auth";
import "./App.css";


function App() {
  
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [tasks, setTasks] = useState(null);
  
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  
  const getData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVERURL}/todos/${userEmail}`);
      const json = await response.json();;
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    if(authToken){
      getData();
    }
  },[]);
  //Sort by date
  const sortedTasks = tasks?.sort( (a,b) => new Date(a.date) - new Date(b.date) ) ;

  return (
    <div className="app">
      {!authToken && <Auth/>}
      {authToken && <>
        <ListHeader listName={"Todo App List"} getData={getData}/>
        <p className="user-email">Welcome back {userEmail}</p>
        {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData}/>)}
      </>}
      <p className="copyright">Developed by Abraham Rivera</p>
    </div>
  );
}

export default App;