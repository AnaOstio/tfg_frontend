import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Input, Dropdown, List, Spin, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';

interface InfiniteSearchSelectInputProps<T> {
    placeholder?: string;
    fetchData: (search: string, page: number) => Promise<{ data: T[]; hasMore: boolean }>;
    renderItem: (item: T) => React.ReactNode;
    onSelect: (item: T) => void;
    value?: string;
    onChange?: (value: string) => void;
    pageSize?: number;
    selectedItem?: T | null;
    onAddItem?: () => void;
}

export function InfiniteSearchSelectInput<T>({
    placeholder,
    fetchData,
    renderItem,
    onSelect,
    value = '',
    onChange,
    pageSize = 10,
    selectedItem,
    onAddItem,
}: InfiniteSearchSelectInputProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [searchValue, setSearchValue] = useState(value);

    const listRef = useRef<HTMLDivElement>(null);
    const searchTriggered = useRef(false);

    const load = useCallback(async (reset = false, search = searchValue) => {
        if (loading || !searchTriggered.current) return;

        setLoading(true);
        try {
            const currentPage = reset ? 1 : page;
            const res = await fetchData(search, currentPage);

            setData(prev => reset ? res.data : [...prev, ...res.data]);
            setHasMore(res.hasMore);
            setPage(currentPage + 1);
        } finally {
            setLoading(false);
        }
    }, [loading, page, searchValue, fetchData]);

    const debouncedSearch = useRef(
        debounce((search: string) => {
            if (search.trim()) {
                searchTriggered.current = true;
                setPage(1);
                setHasMore(true);
                load(true, search);
            } else {
                searchTriggered.current = false;
                setData([]);
            }
        }, 500)
    ).current;

    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    useEffect(() => {
        if (dropdownVisible && searchValue.trim() && !searchTriggered.current) {
            debouncedSearch(searchValue);
        }
    }, [dropdownVisible, searchValue, debouncedSearch]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore && !loading) {
            load();
        }
    };

    const handleSelect = (item: T) => {
        onSelect(item);
        setDropdownVisible(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchValue(newValue);
        onChange?.(newValue);
        debouncedSearch(newValue);
    };

    const dropdownRender = () => (
        <div
            ref={listRef}
            style={{
                maxHeight: 250,
                overflowY: 'auto',
                padding: 8,
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: 4,
            }}
            onScroll={handleScroll}
        >
            <List
                dataSource={data}
                renderItem={(item, idx) => (
                    <List.Item
                        key={idx}
                        style={{ cursor: 'pointer', padding: '8px 12px' }}
                        onClick={() => handleSelect(item)}
                    >
                        {renderItem(item)}
                    </List.Item>
                )}
            />
            {loading && <Spin style={{ display: 'block', margin: '10px auto' }} />}
            {!loading && data.length === 0 && searchTriggered.current && (
                <div style={{ textAlign: 'center', padding: 8 }}>
                    No se encontraron resultados
                </div>
            )}
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
            <div style={{ flex: 1 }}>
                <Dropdown
                    open={dropdownVisible}
                    dropdownRender={dropdownRender}
                    trigger={['click']}
                    onOpenChange={(visible) => setDropdownVisible(visible)}
                >
                    <div style={{ width: '100%' }}>
                        <Input
                            placeholder={placeholder}
                            value={value}
                            onChange={handleInputChange}
                            onClick={() => setDropdownVisible(true)}
                            allowClear
                            style={{ width: '100%' }}
                        />
                    </div>
                </Dropdown>
            </div>

            {selectedItem && (
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAddItem}
                >
                    Añadir
                </Button>
            )}
        </div>
    );
}