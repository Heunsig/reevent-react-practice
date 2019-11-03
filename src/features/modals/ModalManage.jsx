import React from 'react';
import { connect } from 'react-redux'
import TestModal from './TestModal'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

const ModalManage = ({currentModal}) => {
  let renderedModal

  if (currentModal) {
    const { modalType, modalProps } = currentModal
    const ModalComponent = modalLookup[modalType]

    renderedModal = <ModalComponent {...modalProps} />
  }

  return (
    <span>{renderedModal}</span>
  )
}

const modalLookup = {
  TestModal,
  LoginModal,
  RegisterModal
}

const mapStateToProps = state => {
  return {
    currentModal: state.modals
  }
}
export default connect(mapStateToProps)(ModalManage)