import React, { FC, ReactElement, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Card, CardActions, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, Stack, Tooltip, Typography } from '@mui/material';
import { makeStyles, styled } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { fetchTodoItemById } from '../../store/actions/todoList.action';
import { useTranslation } from 'react-i18next';

const ExpandMore = styled((props: IExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  // transition: theme.transitions.create('transform', {
  //   duration: theme.transitions.duration.shortest,
  // }),
}));

const useStyles = makeStyles(() => ({
  todoListCard: {
    minWidth: 360,
    maxWidth: 500,
  },
}));

const AppCard: FC = (): ReactElement => {
  const classes = useStyles();
  const { t } = useTranslation(['common', 'listItem']);
  const navigate = useNavigate();
  const { id: paramsId = '' } = useParams();
  const dispatch = useAppDispatch();
  const { currentItem, isFetching: pending } = useAppSelector((state) => state.todoListSlice);
  const [expanded, setExpanded] = React.useState(false);

  const { title, description, createdAt, updatedAt, isComplete, isFavorite } = currentItem;

  useEffect(() => {
    dispatch(fetchTodoItemById(paramsId));
  }, [paramsId]);

  const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour12: false,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Stack alignItems={'center'} justifyContent={'center'} height={'100%'}>
      {
        currentItem
          ?
          <Card raised className={classes.todoListCard} sx={{width: 360}}>
            <CardHeader
              avatar={
                <Tooltip title={t('common_back_button_title')}>
                  <span>
                    <IconButton
                      onClick={() => navigate('list')}
                      color={'default'}
                      disabled={pending}
                      aria-label={t('common_back_button_title')}>
                      <ArrowBackIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              }
              title={
              <Typography variant={'h6'} noWrap>
                {title}
              </Typography>
              } />

            <CardContent>
              <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'flex-start'} width={'100%'}>
                <Typography variant={'caption'}>
                  {t('common_created_date_p', { ns: 'listItem' })}:&nbsp;
                </Typography>

                <Typography variant={'caption'}>
                  {formatDate(createdAt)}
                </Typography>
              </Stack>

              <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'flex-start'} width={'100%'}>
                <Typography variant={'caption'}>
                  {t('common_created_date_p', { ns: 'listItem' })}:&nbsp;
                </Typography>

                <Typography variant={'caption'}>
                  {formatDate(updatedAt)}
                </Typography>
              </Stack>
            </CardContent>

            <CardActions>
              <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={2} width={'100%'}>
                <Tooltip title={expanded ? t('list_item_hide_desc_button_title', { ns: 'listItem' }) : t('list_item_show_desc_button_title', { ns: 'listItem' })}>
                  <span>
                    <ExpandMore
                      expand={expanded}
                      onClick={() => setExpanded(!expanded)}
                      aria-expanded={expanded}
                      aria-label={expanded ? t('list_item_hide_desc_button_title', { ns: 'listItem' }) : t('list_item_show_desc_button_title', { ns: 'listItem' })}>
                      {
                        expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                      }
                    </ExpandMore>
                  </span>
                </Tooltip>

                <Stack direction={'row'} spacing={2}>
                  <Tooltip title={isComplete ? t('list_item_completed_disable_button_title', { ns: 'listItem' }) : t('list_item_edit_button_title', { ns: 'listItem' })}>
                    <span>
                      <IconButton
                        color={'default'}
                        disabled={pending || isComplete}
                        aria-label={isComplete ? t('list_item_completed_disable_button_title', { ns: 'listItem' }) : t('list_item_edit_button_title', { ns: 'listItem' })}>
                        <EditIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title={t('list_item_completed_button_title', { ns: 'listItem' })}>
                    <span>
                      <IconButton
                        color={isComplete ? 'info' : 'default'}
                        disabled={pending}
                        aria-label={t('list_item_completed_button_title', { ns: 'listItem' })}>
                        <CheckCircleIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title={t('list_item_favorite_button_title', { ns: 'listItem' })}>
                    <span>
                      <IconButton
                        color={isFavorite ? 'warning' : 'default'}
                        disabled={pending}
                        aria-label={t('list_item_favorite_button_title', { ns: 'listItem' })}>
                        <StarIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title={t('common_delete_text')}>
                    <span>
                      <IconButton
                        color={'error'}
                        disabled={pending}
                        aria-label={t('common_delete_text')}>
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Stack>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography variant={'body1'} paragraph>
                  {description ? description : t('list_item_description_empty_p', { ns: 'listItem' })}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
          :
          <Card>
            <CardContent>
              <Typography variant="h6">
                {t('itemNotFound', { ns: 'listItem', id: <strong>{paramsId}</strong> })}
              </Typography>
            </CardContent>
          </Card>
      }
    </Stack>
  );
};

export default AppCard;

interface IExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
