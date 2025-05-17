import { useState } from 'react';
import { Modal } from 'antd';

interface ConfirmationModalProps {
    visible: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModalComponent = ({
    visible,
    message,
    onConfirm,
    onCancel
}: ConfirmationModalProps) => (
    <Modal
        title="Confirmación"
        open={visible}
        onOk={onConfirm}
        onCancel={onCancel}
        okText="Confirmar"
        cancelText="Cancelar"
        styles={{
            mask: { zIndex: 10000 },
            wrapper: { zIndex: 10001 }
        }}
    >
        <p>{message} </p>
    </Modal>
);

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
        <ConfirmationModalComponent
            visible={isModalVisible}
            message={modalConfig?.message || ''
            }
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );

    return { showConfirmation, ConfirmationModal };
};

export default useConfirmation;