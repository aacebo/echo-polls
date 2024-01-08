import { App, ActionHandlerArgs, blocks } from '@aacebo/echo';

export function vote(app: App) {
  return async ({ block_id, message, user, ack }: ActionHandlerArgs<'button'>['message']) => {
    const child = message.body.child as blocks.Column;
    const title = child.children[0] as blocks.Title;
    const options = child.children.slice(1) as blocks.Button[];
    const exists = options.some(o => o.on_click?.value[user.id] === true);

    for (let i = 0; i < options.length; i++) {
      const isPrev = options[i].on_click?.value[user.id] === true;
      const column = (options[i].child as blocks.Container).child as blocks.Column;
      let progress = column.children[1] as blocks.Progress;
      let row = column.children.length === 3 ? column.children[2] as blocks.Row : undefined;
      let value = options[i].on_click?.value || { };

      delete value[user.id];
      column.children[1] = {
        id: progress.id,
        type: 'progress',
        value: isPrev ? progress.value - 1 : progress.value,
        total: !exists ? progress.total + 1 : progress.total
      };

      if (row) {
        const j = row.children.findIndex(child => child.id === user.id)

        if (j > -1) {
          row.children.splice(j, 1);
        }
      } else {
        row = {
          type: 'row',
          children: []
        };

        column.children.push(row);
      }

      if (options[i].id === block_id) {
        value[user.id] = true;

        row.children.push({
          id: user.id,
          type: 'text',
          text: `@${user.name}`
        });

        column.children[1] = {
          id: progress.id,
          type: 'progress',
          value: column.children[1].value + 1,
          total: column.children[1].total
        };
      }

      options[i] = {
        id: options[i].id,
        type: 'button',
        color: options[i].color,
        style: options[i].style,
        child: options[i].child,
        on_click: {
          action: 'vote',
          value: value
        }
      };
    }

    await app.api.messages.update(message.id, {
      child: {
        type: 'column',
        children: [
          title,
          ...options
        ]
      }
    });

    ack();
  };
}
