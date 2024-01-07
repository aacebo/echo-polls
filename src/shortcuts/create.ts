import { App, ShortcutHandlerArgs, blocks } from '@aacebo/echo';

export function create(app: App) {
  return async ({ session_id, chat, ack }: ShortcutHandlerArgs['chat']) => {
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

    await app.api.views.dialogs.open(session_id, {
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
      },
      submit: {
        type: 'text',
        text: 'Send'
      },
      on_submit: {
        action: 'send'
      }
    });

    ack();
  };
}
