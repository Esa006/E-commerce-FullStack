import './bootstrap';
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css'; // Optional: import a theme

// Now you can use it
new Noty({
    text: 'Notification text',
    type: 'success',
}).show();

window.Noty = Noty;