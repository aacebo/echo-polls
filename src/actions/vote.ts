import { App, ActionHandlerArgs, blocks } from '@aacebo/echo';

export function vote(app: App) {
  return async ({ block_id, message, user, ack }: ActionHandlerArgs<'button'>['message']) => {
    const body = message.body.child;

    if (!body) {
      return ack();
    }

    try {
      const options = blocks.getById(body, 'options') as blocks.Column | undefined;

      if (!options) {
        return ack();
      }

      const items = options.children as blocks.Button[];
      const exists = items.some(o => o.on_click?.value[user.id] === true);

      for (let i = 0; i < items.length; i++) {
        const isPrev = items[i].on_click?.value[user.id] === true;
        const column = (items[i].child as blocks.Container).child as blocks.Column;

        let progress = column.children[1] as blocks.Progress;
        let row = column.children.length === 3 ? column.children[2] as blocks.Row : undefined;
        let value = items[i].on_click?.value || { };
        delete value[user.id];

        progress.value = isPrev ? progress.value - 1 : progress.value;
        progress.total = !exists ? progress.total + 1 : progress.total;

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

        if (items[i].id === block_id) {
          value[user.id] = true;
          progress.value++;
          row.children.push({
            id: user.id,
            type: 'text',
            text: `@${user.name}`
          });
        }

        items[i].on_click = {
          action: 'vote',
          value: value
        };
      }

      await app.api.messages.update(message.id, {
        child: body
      });
    } catch (err) {
      app.log(err);
    }

    ack();
  };
}
