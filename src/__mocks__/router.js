import {ROUTES, ROUTES_PATH} from "../constants/routes.js";

export default () => {
  /* It's storing the root div */
  const rootDiv = document.getElementById("root")

  /* It's loading container according to Route Path */
  if (window.location.hash === ROUTES_PATH['Bills']) {
    rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true })
    /* It's highlighting the side icon */
    const divIcon1 = document.getElementById('layout-icon1')
    const divIcon2 = document.getElementById('layout-icon2')
    divIcon1.classList.add('active-icon')
    divIcon2.classList.remove('active-icon')
  }
}
