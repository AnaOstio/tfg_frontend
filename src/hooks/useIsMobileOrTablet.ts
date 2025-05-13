import { useState, useEffect } from 'react';

const useIsMobileOrTablet = (): boolean => {
    const [width, setWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width < 1024;
};

export default useIsMobileOrTablet;
