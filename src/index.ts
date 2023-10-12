import './style.css';
import CompositionRoot from './composition-root';

if (process.env.NODE_ENV !== 'production') {
    console.log(`Looks like we are in ${process.env.NODE_ENV} mode!`);
}

new CompositionRoot().composeApplication();
