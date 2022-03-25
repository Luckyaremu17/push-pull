import Mails from './modules/mails';

export default (app) => {
  app.use('/', Mails);
}