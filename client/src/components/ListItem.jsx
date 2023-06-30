import { useState } from 'react';
import TickIcon from './TickIcon';
import ProgressBar from './ProgessBar'
import Modal from './Modal';

function ListItem({task, getData}) {
  const [showModal, setShowModal] = useState(false);
  const deleteItem = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVERURL}/todos/${task.id}`, {
        method:"DELETE"
      });
      if (response.status === 200) getData();
    } catch (err) {
      console.error(err);
    }
  };
  return (
      <div className="list-item">
        <div className="info-container">
          <TickIcon/>
          <p className="task-title">{task.title}</p>
          <ProgressBar progress={task.progress}/>
        </div>
        <div className="button-container">
          <button className='edit'onClick={setShowModal} >EDIT</button>
          <button className='delete' onClick={deleteItem}>DELETE</button>
        </div>
        {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task}/>}
      </div>
    );
  }
  
  export default ListItem;