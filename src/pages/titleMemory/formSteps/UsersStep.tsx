// src/components/formSteps/UsersStep.tsx
import React, { useState, useCallback } from 'react';
import { Input, Button, Table, Select, Space, Popconfirm, notification, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { InfiniteSearchSelectInput } from '../../../components/inputs/InfiniteSearchSelectInput';
import { useSearchUsers } from '../../../hooks/useUsers';

const { Option } = Select;

export type UserItem = {
    key: string;    // se usará el email como key
    email: string;
    roles: string[]; // array de roles asignados
};

type UsersStepProps = {
    users: UserItem[];
    onUsersChange: (newList: UserItem[]) => void;
    onPrev: () => void;
    onNext: () => void;
};

export const UsersStep: React.FC<UsersStepProps> = ({ users, onUsersChange, onPrev, onNext }) => {
    const [notif] = notification.useNotification();

    // Estados para la búsqueda de usuario
    const [searchValue, setSearchValue] = useState('');
    const [selectedSearchItem, setSelectedSearchItem] = useState<{ email: string } | null>(null);

    // Roles disponibles
    const ALL_ROLES = ['EDIT', 'DELETE', 'OWNER', 'SUBJECTS'];

    const { mutateAsync: searchUsersMutate } = useSearchUsers();

    const fetchUsers = async (search: string, page: number) => {
        const res = await searchUsersMutate({ search, page });
        return {
            data: res.data,
            hasMore: res.hasMore,
        };
    };

    /**
     * Añade el usuario seleccionado (o el texto libre, si no hubiera seleccionado ninguno).
     */
    const handleAddUser = useCallback(() => {
        let emailTrimmed = selectedSearchItem
            ? selectedSearchItem.email.toLowerCase()
            : searchValue.trim().toLowerCase();

        if (!emailTrimmed) {
            notif.warning({
                message: 'Correo vacío',
                description: 'Por favor ingresa o selecciona un correo electrónico.',
            });
            return;
        }
        // Validar formato básico de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
            notif.error({
                message: 'Formato inválido',
                description: 'El correo ingresado no parece válido.',
            });
            return;
        }
        // Comprobar duplicados
        const exists = users.some(u => u.email === emailTrimmed);
        if (exists) {
            notif.error({
                message: 'Usuario duplicado',
                description: 'Ese correo ya está en la lista.',
            });
            return;
        }
        // Añadir usuario con roles vacíos inicialmente
        const newUser: UserItem = {
            key: emailTrimmed,
            email: emailTrimmed,
            roles: [],
        };
        onUsersChange([...users, newUser]);

        // Reiniciar estados de búsqueda
        setSearchValue('');
        setSelectedSearchItem(null);
    }, [searchValue, selectedSearchItem, notif, onUsersChange, users]);

    /**
     * Elimina un usuario de la lista
     */
    const handleRemoveUser = useCallback(
        (key: string) => {
            const filtered = users.filter(u => u.key !== key);
            onUsersChange(filtered);
        },
        [onUsersChange, users]
    );

    /**
     * Cambia los roles de un usuario concreto
     */
    const handleRolesChange = useCallback(
        (key: string, newRoles: string[]) => {
            const updated = users.map(u => {
                if (u.key === key) {
                    return { ...u, roles: newRoles };
                }
                return u;
            });
            onUsersChange(updated);
        },
        [onUsersChange, users]
    );

    // Columnas de la tabla
    const columns = [
        {
            title: 'Correo',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            width: "50%",
            render: (_: any, record: UserItem) => (
                <Select
                    mode="multiple"
                    value={record.roles}
                    onChange={vals => handleRolesChange(record.key, vals)}
                    style={{ width: "100%" }}
                    placeholder="Selecciona roles"
                    dropdownMatchSelectWidth={false}
                    tagRender={(props) => (
                        <Tag
                            closable={props.closable}
                            onClose={props.onClose}
                            style={{
                                marginRight: 3,
                                maxWidth: "120px",
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {props.label}
                        </Tag>
                    )}
                >
                    {ALL_ROLES.map(r => (
                        <Option key={r} value={r}>
                            {r}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 100,
            render: (_: any, record: UserItem) => (
                <Popconfirm
                    title="¿Eliminar usuario?"
                    onConfirm={() => handleRemoveUser(record.key)}
                    okText="Sí"
                    cancelText="No"
                >
                    <Button type="text" icon={<DeleteOutlined />} danger />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <h2>Asignar usuarios y roles</h2>

            {/* ------------------------------------------------------------------ */}
            {/* Aquí usamos InfiniteSearchSelectInput para buscar “usuarios” dentro del backend */}
            {/* ------------------------------------------------------------------ */}
            <InfiniteSearchSelectInput<{ email: string }>
                placeholder="Buscar usuario por correo"
                fetchData={fetchUsers}
                renderItem={(item) => <span>{item.email}</span>}
                onSelect={(item) => {
                    setSelectedSearchItem(item);
                    setSearchValue(item.email);
                }}
                value={searchValue}
                onChange={(val) => {
                    setSearchValue(val);
                    setSelectedSearchItem(null);
                }}
                selectedItem={selectedSearchItem}
                onAddItem={handleAddUser}
            />

            {/* ------------------------------------------------------------------ */}
            {/* Una vez que el usuario haga clic en “Añadir” (botón junto al input),      */}
            {/* se ejecutará handleAddUser().                                           */}
            {/* ------------------------------------------------------------------ */}

            <Table<UserItem>
                dataSource={users}
                columns={columns}
                pagination={false}
                rowKey="key"
                locale={{ emptyText: 'No hay usuarios agregados' }}
                style={{ marginTop: 16, marginBottom: 24 }}
            />

            <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button onClick={onPrev} style={{ marginRight: 8 }}>Atrás</Button>
                <Button type="primary" onClick={onNext}>Siguiente</Button>
            </div>
        </div>
    );
};

export default UsersStep;