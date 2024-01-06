import { App, ShortcutHandlerArgs, blocks } from '@aacebo/echo';

export function create(app: App) {
  return async ({ chat, user, ack }: ShortcutHandlerArgs['chat']) => {
    const options: blocks.Block[] = [
      {
        id: '0',
        type: 'input',
        placeholder: {
          type: 'text',
          text: 'Name...'
        }
      }
    ];

    await app.api.views.dialogs.open(user.name, {
      id: 'polls.create',
      context_id: chat.id,
      type: 'chat',
      title: {
        type: 'text',
        text: 'New Poll'
      },
      body: {
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
                      name: 'plus.app.fill'
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
    });

    ack();
  };
}
