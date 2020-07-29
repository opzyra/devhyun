import development from './development';
import production from './production';

let CONFIG = development;

if (process.env.NODE_ENV == 'production') {
  CONFIG = production;
}

export default CONFIG;
