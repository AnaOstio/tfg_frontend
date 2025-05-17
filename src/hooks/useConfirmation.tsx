// src/hooks/useConfirmation.ts
import { useState } from 'react';
import { Modal } from 'antd';

const useConfirmation = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const showConfirmation = (message: string, onConfirm: () => void) => {
        setModalConfig({ message, onConfirm });
        setIsModalVisible(true);
    };

    const handleConfirm = () => {
        modalConfig?.onConfirm();
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const ConfirmationModal = () => (
        <Modal
            title="Confirmación"
            open={isModalVisible}
            onOk={handleConfirm}
            onCancel={handleCancel}
            okText="Confirmar"
            cancelText="Cancelar"
            styles={{
                mask: {
                    zIndex: 10000,
                },
                wrapper: {
                    zIndex: 10001,
                }
            }}
        >
            <p>{modalConfig?.message}</p>
        </Modal>
    );

    return { showConfirmation, ConfirmationModal };
};

export default useConfirmation;