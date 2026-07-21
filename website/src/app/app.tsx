import './app.css';
import './common/layout.css'

function App() {
  return (
    <div className='app'>
      <header className='app-header'></header>
      <body className='app-body'>
        <h1>Tech Everyday</h1>
        <div>We do software consulting, want to chat? <a href='mailto: info@tech-everyday.com' rel='noreferrer' target='_blank'>Shoot us an email!</a></div>
      </body>
      <footer className='app-footer col'>
        <div className='row'>
          <p>Email:&nbsp;<a href='mailto: info@tech-everyday.com' rel='noreferrer' target='_blank'>info@tech-everyday.com</a></p>
          <p>Phone: +1 612 559 0640</p>
          <p>Hours: 9AM - 5PM CST</p>
        </div>
        <div>Tech Everyday LLC © 2023</div>
      </footer>
    </div>
  );
}

export default App;
