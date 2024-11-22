import { useEffect, useState } from 'react';

export default function useDebounce(value, delay) {
    const [newValue, setNewValue] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => {
            setNewValue(value);
        }, delay);

        return () => {
            clearTimeout(id);
        };
    }, [value]);

    return newValue;
}
