import '../css/style.css';
import '../css/style.scss';

import Momentum from './Momentum';

function router() {
    // const mainWrapper = document.querySelector('.wrapper');
    const contentContainer = document.querySelector('.content-container');
    const mainContent = new Momentum();
    contentContainer.innerHTML = mainContent.render();

    mainContent.afterRender();
}



window.addEventListener('load', router);
