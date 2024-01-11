import { App, ActionHandlerArgs, blocks } from '@aacebo/echo';

export function addOption(app: App) {
  return async ({ session_id, chat, value, ack }: ActionHandlerArgs<'button', blocks.Block[]>['chat']) => {
    const options: blocks.Block[] = [
      ...value,
      {
        id: value.length.toString(),
        type: 'input',
        placeholder: {
          type: 'text',
          text: 'Name...'
        }
      }
    ]

    try {
      await app.api.views.dialogs.open(session_id, {
        id: 'polls.create',
        context_id: chat.id,
        type: 'chat',
        title: {
          type: 'text',
          text: 'New Poll'
        },
        body: {
          type: 'container',
          padding: {
            left: 10,
            right: 10
          },
          child: {
            id: 'main',
            type: 'form',
            children: [
              {
                id: 'title',
                type: 'input',
                label: {
                  type: 'text',
                  text: 'Title'
                },
                placeholder: {
                  type: 'text',
                  text: 'Title...'
                }
              },
              {
                id: 'options',
                type: 'form',
                children: [
                  {
                    type: 'row',
                    children: [
                      {
                        type: 'text',
                        text: 'Options:'
                      },
                      {
                        type: 'spacer'
                      },
                      {
                        type: 'button',
                        child: {
                          type: 'icon',
                          name: 'plus'
                        },
                        on_click: {
                          action: 'add-option',
                          value: options
                        }
                      }
                    ]
                  },
                  ...options,
                  {
                    type: 'spacer'
                  }
                ]
              }
            ],
            on_submit: {
              action: 'send'
            }
          }
        }
      });
    } catch (err) {
      app.log(err);
    }

    ack();
  };
}
