import { FormattedMessage } from 'react-intl';
import { makeStyles } from '@mui/styles';
import NextLink from 'next/link';
import { CircularProgress, Link, Theme } from '@mui/material';
import { FC, useContext } from 'react';

import BrowserDraggableItem from './BrowserDragableItem';
import { BrowserRowContext, BrowserRowDropProps } from './BrowserRow';
import ViewBrowserModel, {
  ViewBrowserItem,
} from 'features/views/models/ViewBrowserModel';

interface BrowserItemProps {
  basePath: string;
  item: ViewBrowserItem;
  model: ViewBrowserModel;
}

const useStyles = makeStyles<Theme, BrowserRowDropProps>({
  itemLink: {
    '&:hover': {
      textDecoration: 'underline',
    },
    color: 'inherit',
    fontWeight: (props) => (props.active ? 'bold' : 'normal'),
    textDecoration: 'none',
  },
});

const BrowserItem: FC<BrowserItemProps> = ({ basePath, item, model }) => {
  const dropProps = useContext(BrowserRowContext);
  const styles = useStyles(dropProps);

  if (item.type == 'back') {
    const subPath = item.folderId ? 'folders/' + item.folderId : '';
    const msgPrefix = dropProps.active ? 'moveTo' : 'backTo';

    return (
      <NextLink href={`${basePath}/${subPath}`} passHref>
        <Link className={styles.itemLink}>
          {item.title ? (
            <FormattedMessage
              id={`pages.people.views.browser.${msgPrefix}Folder`}
              values={{ folder: <em>{item.title}</em> }}
            />
          ) : (
            <FormattedMessage
              id={`pages.people.views.browser.${msgPrefix}Root`}
            />
          )}
        </Link>
      </NextLink>
    );
  } else {
    return (
      <BrowserDraggableItem item={item}>
        <NextLink href={`${basePath}/${item.id}`} passHref>
          <Link className={styles.itemLink}>{item.title}</Link>
        </NextLink>
        {model.itemIsRenaming(item.type, item.data.id) && (
          <CircularProgress size={20} />
        )}
      </BrowserDraggableItem>
    );
  }
};

export default BrowserItem;