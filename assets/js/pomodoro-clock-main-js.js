// God Bless
const audio = document.getElementById('beep');

class App extends React.Component {
  // reactState  
  state = {
    countForBreak: 5,
    countForSession: 25,
    pomodoroClockCount: 25 * 60,
    
    presentPomodoroClockTimerText: 'Session',
    pomodoroClockIsPlaying: false
  }
  
  constructor(props) {
    super(props);
    this.pomodoroClockInterval = undefined;
  }
  
  componentWillUnmount() {
    clearInterval(this.pomodoroClockInterval);
  }
  
  handlePomodoroClockPlayAndPauseButton = () => {
    const { pomodoroClockIsPlaying } = this.state;
    
    if (pomodoroClockIsPlaying) {
      clearInterval(this.pomodoroClockInterval);
      
      this.setState({
        pomodoroClockIsPlaying: false
      });
    } else {
      this.setState({
        pomodoroClockIsPlaying: true
      });
      this.pomodoroClockInterval = setInterval(() => {
        const { pomodoroClockCount, presentPomodoroClockTimerText, countForBreak, countForSession} = this.state;
        
        if (pomodoroClockCount === 0) {
          this.setState({
            presentPomodoroClockTimerText: (presentPomodoroClockTimerText === 'Session') ? 'Break' : 'Session',
            pomodoroClockCount: (presentPomodoroClockTimerText === 'Session') ? (countForBreak * 60) : (countForSession * 60)
          });
 
            audio.play();
        } else {
            this.setState({
              pomodoroClockCount: pomodoroClockCount - 1
            });
        }
      }, 1000);  
    }
    
  }
  
  handlePomodoroClockResetButton = () => {
    this.setState({
        countForBreak: 5,
        countForSession: 25,
        pomodoroClockCount: 25 * 60,
        presentPomodoroClockTimerText: 'Session',
        pomodoroClockIsPlaying: false
    });
   
    clearInterval(this.pomodoroClockInterval);
    
    audio.pause();
    audio.currentTime = 0; // currentPomodoroClockTime Audio currentTime
  }
   
  convertPomodoroClockTimeFormat = (clockCount) => {
    let clockMinutes = Math.floor(clockCount / 60);
    let clockSeconds = clockCount % 60;
    
    clockMinutes = clockMinutes < 10 ? ('0'+clockMinutes) : clockMinutes;
    clockSeconds = clockSeconds < 10 ? ('0'+clockSeconds) : clockSeconds;
    
    return `${clockMinutes}:${clockSeconds}`;
  }
  
  handleIncreaseForBreak = () => {
    const { countForBreak, pomodoroClockIsPlaying, presentPomodoroClockTimerText } = this.state;
    
    if (countForBreak < 60) { 
      
      if (!pomodoroClockIsPlaying && presentPomodoroClockTimerText === 'Break') {
        this.setState({
          countForBreak: countForBreak + 1,
          pomodoroClockCount: (countForBreak + 1) * 60
        });
      } else {
          this.setState({
            countForBreak: countForBreak + 1
          });  
        }
    }
  }
  
  handleDecreaseForBreak = () => {
    const { countForBreak, pomodoroClockIsPlaying, presentPomodoroClockTimerText } = this.state;
    
    if (countForBreak > 1) {
      
      if (!pomodoroClockIsPlaying && presentPomodoroClockTimerText === 'Break') {
        this.setState({
          countForBreak: countForBreak - 1,
          pomodoroClockCount: (countForBreak - 1) * 60
        });
      } else {
        this.setState({
          countForBreak: countForBreak - 1
        });  
      }
    }
    
  }
  
  handleIncreaseForSession = () => {
    const { countForSession, pomodoroClockIsPlaying, presentPomodoroClockTimerText } = this.state;
    
    if (countForSession < 60) {
      
      if (!pomodoroClockIsPlaying && presentPomodoroClockTimerText === 'Session') {
        this.setState({
          countForSession: countForSession + 1,
          pomodoroClockCount: (countForSession + 1) * 60
        });
      } else {
            this.setState({
              countForSession: countForSession + 1
            });  
         }
    }
    
  }
  
  handleDecreaseForSession = () => {
    const { countForSession, pomodoroClockIsPlaying, presentPomodoroClockTimerText } = this.state;
    
    if (countForSession > 1) {
        
      if (!pomodoroClockIsPlaying && presentPomodoroClockTimerText === 'Session') {
        this.setState({
          countForSession: countForSession - 1,
          pomodoroClockCount: (countForSession - 1) * 60
        });
      } else {
            this.setState({
              countForSession: countForSession - 1
            });  
         }    
      }
  }
  
  render() {
    const { countForBreak, countForSession, pomodoroClockCount, presentPomodoroClockTimerText, pomodoroClockIsPlaying } = this.state;
    
    const propsForBreak = {
      pomodoroClockTitle: 'Break',
      pomodoroClockCount: countForBreak,
      handlePomodoroClockIncreaseButton: this.handleIncreaseForBreak,
      handlePomodoroClockDecreaseButton: this.handleDecreaseForBreak
    }
    
    const propsForSession = {
      pomodoroClockTitle: 'Session',
      pomodoroClockCount: countForSession,
      handlePomodoroClockIncreaseButton: this.handleIncreaseForSession,
      handlePomodoroClockDecreaseButton: this.handleDecreaseForSession
    }
    
    return (
      <div>
        <div className="flex">
          <SetTwentyFivePlusFiveTimer {...propsForBreak} />
          <SetTwentyFivePlusFiveTimer {...propsForSession} />
        </div>
        <div className="pomodoro-clock-container zoom">
          <h1>Pomodoro Clock by <span id="header-span-id">PJKMT</span></h1>
          
          <h1 id="timer-label"><i className="far fa-clock" id="clock-logo-fontawesome"></i>  {presentPomodoroClockTimerText}</h1>
          <span id="time-left">{this.convertPomodoroClockTimeFormat(pomodoroClockCount)}</span>
                   
          <div className="flex">
            <button id="start_stop" onClick={this.handlePomodoroClockPlayAndPauseButton}><i className={`fas fa-${pomodoroClockIsPlaying ? 'pause' : 'play'}`}></i></button>
            <button id="reset" onClick={this.handlePomodoroClockResetButton}><i className="fas fa-redo"></i></button>
          </div>
        </div>
      </div>
    );
  }
}

const SetTwentyFivePlusFiveTimer = (props) => {
  const iDentification = props.pomodoroClockTitle.toLowerCase();
  return (
  <div className="pomodoro-clock-timer-container">
      
    <h2 id={`${iDentification}-label`} className="zoom">Set {props.pomodoroClockTitle} Length</h2>
    <div className="flex wrapper-for-buttons">
      <button id={`${iDentification}-increment`} onClick={props.handlePomodoroClockIncreaseButton}><i className="fas fa-plus"></i></button>
      <span id={`${iDentification}-length`} className="zoom">{props.pomodoroClockCount}</span>
      <button id={`${iDentification}-decrement`} onClick={props.handlePomodoroClockDecreaseButton}><i className="fas fa-minus"></i></button>
    </div>
  </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('twentyFivePlusFiveClockID'));