function ProgressBar({progress}) {
  const colors = [
    'rgb(143,143,143)',
    'rgb(181,237,184)',
    'rgb(110,232,116)',
    'rgb(43,183,50)',
  ];
  const randomColor = colors[Math.floor(Math.random() *colors.length)];

  return (
      <div className="outer-bar">
        <div 
        className="inner-bar"
        style={{ backgroundColor: progress <= 10? 
            colors[0]:
            progress <= 25?
            colors[1]:
            progress <= 75?
            colors[2]:
            colors[3]
            , width: `${progress}%`}}>

        </div>
      </div>
    );
  }
  
  export default ProgressBar;
