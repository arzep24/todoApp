import { useState } from "react";
import { useCookies } from "react-cookie";

function Modal({mode, setShowModal,getData, task}) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const editMode = mode === 'edit'? true:false;

  const [data, setData] = useState({
    user_email : editMode? task.user_email : cookies.Email,
    title: editMode? task.title:"",
    progress: editMode? task.progress:50,
    date: editMode ?task.date : new Date()
  });
  const handleChange = (e) => {
    const {name, value} = e.target;
    setData(data => ({...data, [name] : value}));
  };
  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVERURL}/todos`, {
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if (response.status == 200) {
        console.log("Got it chief...");
        getData();
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };
  const editData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVERURL}/todos/${task.id}`, {
        method:"PUT",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if (response.status === 200)
      {
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
      <div className="overlay">
        <div className="modal">
          <div className="form-title-container">
            <h3>Let's {mode} your task</h3>
            <button onClick={() => setShowModal(false)}>X</button>
          </div>
          <form action="">
            <input 
              required
              maxLength={30}
              placeholder="Your task goes here"
              type="text" name="title" value={data.title} 
              onChange={handleChange}/>
            <br/>
            <label htmlFor="range">Drag to select your current progress</label>
            <input 
              required
              min="0"
              max={100} 
              id="range"
              type="range" name="progress" value={data.progress}
              onChange={handleChange} />
            <input className={mode} type="submit" value="SUBMIT" onClick={editMode? editData: postData}/>
          </form>
        </div>
      </div>
    );
  }
  
  export default Modal;