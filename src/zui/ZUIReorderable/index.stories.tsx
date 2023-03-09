import { Box, Paper } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ReactNode, useState } from 'react';

import ZUIReorderable from '.';

export default {
  component: ZUIReorderable,
  title: 'Atoms/ZUIReorderable',
} as ComponentMeta<typeof ZUIReorderable>;

const Template: ComponentStory<typeof ZUIReorderable> = (args) => {
  const [items, setItems] = useState(args.items);

  return (
    <div style={{ width: 400 }}>
      <ZUIReorderable
        items={items}
        onReorder={(ids) => {
          setItems(ids.map((id) => args.items.find((item) => item.id == id)!));
        }}
      />
    </div>
  );
};

export const basic = Template.bind({});
basic.args = {
  items: [
    { id: 1, renderContent: () => <Item>Hello</Item> },
    { id: 2, renderContent: () => <Item>Goodbye</Item> },
    { id: 3, renderContent: () => <Item>See you later</Item> },
    { id: 4, renderContent: () => <Item>Good night</Item> },
  ],
};

function Item({ children }: { children: ReactNode }): JSX.Element {
  return (
    <Paper>
      <Box my={1} p={3}>
        <h1>{children}</h1>
      </Box>
    </Paper>
  );
}
