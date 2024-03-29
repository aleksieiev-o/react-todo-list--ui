import React, { FC, ReactElement, useEffect, useState } from 'react';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { inputChangeEventType, inputChangeHandler } from '../../utils/inputChangeHandler';
import AppModal from '../../components/AppModal';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { IUseModalVisibility } from '../../hooks/useModalVisibility';
import { changeUserInfo } from '../../store/actions/user.action';
import { useTranslation } from 'react-i18next';

const EditUserInfoModal: FC<IUseModalVisibility> = ({modalVisibility, setModalVisibility}): ReactElement => {
  const { t } = useTranslation(['common', 'userInfo']);
  const dispatch = useAppDispatch();
  const { user, isFetching: isPending } = useAppSelector((state) => state.userSlice);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const {id, name, email} = user;

  useEffect(() => {
    setUserName(name);
    setUserEmail(email);
  }, []);

  const submitHandler = async (): Promise<void> => {
    await dispatch(changeUserInfo({
      id,
      name: userName,
      email: userEmail,
    }));

    await resetForm();
  };

  const resetForm = (): void => {
    setUserName(name);
    setUserEmail(email);
  };

  return (
    <AppModal
      headerText={t('user_info_edit_user_modal_title', { ns: 'userInfo' })}
      footerSubmitButtonText={t('common_save_text')}
      footerCancelButtonText={t('common_cancel_text')}
      visibilityHandlers={{modalVisibility, setModalVisibility}}
      submitHandler={submitHandler}
      submitButtonType={'primary'}
      isPending={isPending}>
      <>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="user-name-input">
            {t('authorization_name_label_input', { ns: 'authorization' })}
          </InputLabel>

          <OutlinedInput
            id="user-name-input"
            type={'text'}
            value={userName}
            onChange={(e: inputChangeEventType) => inputChangeHandler(e, setUserName)}
            fullWidth
            autoFocus
            label={t('authorization_name_label_input', { ns: 'authorization' })}/>
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="user-email-input">
            {t('authorization_email_label_input', { ns: 'authorization' })}
          </InputLabel>

          <OutlinedInput
            id="user-email-input"
            type={'text'}
            value={userEmail}
            onChange={(e: inputChangeEventType) => inputChangeHandler(e, setUserEmail)}
            fullWidth
            label={t('authorization_email_label_input', { ns: 'authorization' })}/>
        </FormControl>
      </>
    </AppModal>
  );
};

export default EditUserInfoModal;
