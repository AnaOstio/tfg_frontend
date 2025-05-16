import React, { useEffect, useRef, useState } from 'react';
import { Input, Dropdown, List, Spin } from 'antd';
import debounce from 'lodash/debounce';

interface InfiniteSearchSelectInputProps<T> {
    placeholder?: string;
    fetchData: (search: string, page: number) => Promise<{ data: T[]; hasMore: boolean }>;
    renderItem: (item: T) => React.ReactNode;
    onSelect: (item: T) => void;
    value?: string;
    pageSize?: number;
}

export function InfiniteSearchSelectInput<T>({
    placeholder,
    fetchData,
    renderItem,
    onSelect,
    value = '',
    pageSize = 10,
}: InfiniteSearchSelectInputProps<T>) {
    const [search, setSearch] = useState('');
    const [inputValue, setInputValue] = useState(value);
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const listRef = useRef<HTMLDivElement>(null);

    const load = async (reset = false) => {
        if (loading) return;
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const res = await fetchData(search, currentPage);
        setData(prev => (reset ? res.data : [...prev, ...res.data]));
        setHasMore(res.hasMore);
        setPage(currentPage + 1);
        setLoading(false);
    };

    const debouncedSearch = debounce((value: string) => {
        setSearch(value);
        setPage(1);
        setHasMore(true);
        load(true);
    }, 300);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        if (dropdownVisible) {
            load(true);
        }
    }, [dropdownVisible]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 20 && hasMore && !loading) {
            load();
        }
    };

    const dropdownRender = () => (
        <div
            ref={listRef}
            style={{
                maxHeight: 250,
                overflowY: 'auto',
                padding: 8,
                backgroundColor: '#fff',
                zIndex: 1050,
                position: 'relative',
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
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            onSelect(item);
                            setDropdownVisible(false);
                        }}
                    >
                        {renderItem(item)}
                    </List.Item>
                )}
            />
            {loading && <Spin style={{ display: 'block', textAlign: 'center', margin: '10px auto' }} />}
            {!loading && data.length === 0 && <div style={{ textAlign: 'center' }}>Sin resultados</div>}
        </div>
    );

    return (
        <Dropdown
            open={dropdownVisible}
            dropdownRender={dropdownRender}
            trigger={['click']}
        >
            <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={e => {
                    setInputValue(e.target.value);
                    debouncedSearch(e.target.value);
                }}
                onFocus={() => setDropdownVisible(true)}
                onBlur={() => setTimeout(() => setDropdownVisible(false), 200)}
            />
        </Dropdown>
    );
}