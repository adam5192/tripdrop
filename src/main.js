import "leaflet/dist/leaflet.css";
import { signUp, signIn, getCurrentUser } from "./data/auth.js";

import { App } from "./app.js";

window.signUp = signUp;
window.signIn = signIn;
window.getCurrentUser = getCurrentUser;
const app = new App();
