// src/components/Chatbot.js
import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the root element for accessibility

const Chatbot = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <button onClick={openModal} style={styles.button}>
        Chat with us!
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <button onClick={closeModal} style={styles.closeButton}>
          Close
        </button>
        <iframe
          src="https://cdn.botpress.cloud/webchat/v2/shareable.html?botId=b6c18bba-dd16-4d47-a0ee-e82a6bd8851e"
          title="Chatbot"
          style={styles.iframe}
        />
      </Modal>
    </>
  );
};

const styles = {
  button: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 1000,
  },
  closeButton: {
    marginBottom: '10px',
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  iframe: {
    width: '100%',
    height: '480px',
    border: 'none',
  },
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    height: '90%',
  },
};

export default Chatbot;
