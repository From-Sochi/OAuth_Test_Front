import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Redirect() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/dashboard/1', { replace: true });
    }, [navigate]);

    return <div>Перенаправление...</div>;
}

export default Redirect;