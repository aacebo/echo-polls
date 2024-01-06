import { App } from '@aacebo/echo';

import * as shortcuts from './shortcuts';
import * as actions from './actions';

if (!process.env.CLIENT_ID) {
  throw new Error('`CLIENT_ID` is required');
}

if (!process.env.CLIENT_SECRET) {
  throw new Error('`CLIENT_SECRET` is required');
}

const app = new App({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.shortcut('create', shortcuts.create(app));
app.action('add-option', actions.addOption(app));
app.action('send', actions.send(app));
app.action<'button', any, 'message'>('vote', actions.vote(app));
app.action('set-title', ({ ack }) => ack());
app.start();
