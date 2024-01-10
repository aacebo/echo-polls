import { App, ActionHandlerArgs, blocks } from '@aacebo/echo';

import { Form } from '../models';

export function send(app: App) {
  return async ({ session_id, chat, user, value, ack }: ActionHandlerArgs<'form', Form>['chat']) => {
    try {
      await app.api.views.dialogs.close(session_id, 'polls.create');
      await app.api.messages.createFor(user.name, chat.id, {
        visibility: 'public',
        child: {
          type: 'container',
          padding: {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
          },
          child: {
            type: 'column',
            children: [
              {
                type: 'title',
                text: value.title
              },
              ...Object.values(value.options).map((o, i) => ({
                id: i.toString(),
                type: 'container',
                padding: {
                  top: 5,
                  right: 5,
                  bottom: 5,
                  left: 5
                },
                child: {
                  type: 'button',
                  child: {
                    type: 'column',
                    children: [
                      {
                        type: 'text',
                        text: o
                      },
                      {
                        type: 'progress',
                        value: 0,
                        total: 0
                      }
                    ]
                  },
                  on_click: {
                    action: 'vote',
                    value: { }
                  }
                }
              } as blocks.Container))
            ]
          }
        }
      });
    } catch (err) {
      app.log(err);
    }

    ack();
  };
}
