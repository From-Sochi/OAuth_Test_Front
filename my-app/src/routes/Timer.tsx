import { useState, useRef, useEffect, useCallback, useMemo } from "react";

interface LapTime {
    id: number;
    time: string;
    lapTime: number;
}

function Timer() {
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<LapTime[]>([]);
    const [displayTime, setDisplayTime] = useState(0);
    const timerId = useRef<number | null>(null);
    const lapIdCounter = useRef(1);
    const accumulatedTimeRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    // Форматирование времени
    const formatTime = useCallback((ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);

        return { hours, minutes, seconds, milliseconds };
    }, []);

    // Форматированное время для отображения
    const formattedTime = useMemo(() => {
        const { hours, minutes, seconds, milliseconds } = formatTime(displayTime);
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            milliseconds: milliseconds.toString().padStart(2, '0')
        };
    }, [displayTime, formatTime]);

    // Форматирование времени для отображения круга (простой вариант)
    const formatLapTime = useCallback((ms: number) => {
        const { hours, minutes, seconds, milliseconds } = formatTime(ms);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        } else if (minutes > 0) {
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        } else {
            return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
        }
    }, [formatTime]);

    // Запуск таймера
    const handleStart = useCallback(() => {
        if (isRunning) return;

        setIsRunning(true);
        startTimeRef.current = Date.now() - accumulatedTimeRef.current;

        const updateTimer = () => {
            const currentTime = Date.now() - startTimeRef.current;
            accumulatedTimeRef.current = currentTime;
            setDisplayTime(currentTime);
            timerId.current = requestAnimationFrame(updateTimer);
        };

        timerId.current = requestAnimationFrame(updateTimer);
    }, [isRunning]);

    // Остановка таймера
    const handleStop = useCallback(() => {
        if (!isRunning) return;

        setIsRunning(false);
        if (timerId.current) {
            cancelAnimationFrame(timerId.current);
            timerId.current = null;
        }
    }, [isRunning]);

    // Сброс таймера
    const handleReset = useCallback(() => {
        handleStop();
        accumulatedTimeRef.current = 0;
        setDisplayTime(0);
        setLaps([]);
        lapIdCounter.current = 1;
    }, [handleStop]);

    // Фиксация круга - ПРОСТАЯ ЛОГИКА
    const handleLap = useCallback(() => {
        if (!isRunning) return;

        const currentLapTime = accumulatedTimeRef.current;
        const lapText = formatLapTime(currentLapTime);

        const newLap: LapTime = {
            id: lapIdCounter.current++,
            time: lapText,
            lapTime: currentLapTime
        };

        setLaps(prevLaps => [newLap, ...prevLaps]);
    }, [isRunning, formatLapTime]);

    // Удаление круга
    const handleDeleteLap = useCallback((id: number) => {
        setLaps(prevLaps => prevLaps.filter(lap => lap.id !== id));
    }, []);

    // Очистка при размонтировании
    useEffect(() => {
        return () => {
            if (timerId.current) {
                cancelAnimationFrame(timerId.current);
            }
        };
    }, []);

    return (
        <div className="timer-container">
            <h2>Timer:</h2>
            <hr />

            {/* Блок отображения времени */}
            <div className="time-group">
                <label>Время: </label>
                <span className="time-display">
                    {formattedTime.hours}:{formattedTime.minutes}:{formattedTime.seconds}
                    <span className="milliseconds">.{formattedTime.milliseconds}</span>
                </span>
            </div>

            {/* Кнопки управления */}
            <div className="timer-buttons">
                <button onClick={handleLap} disabled={!isRunning}>
                    Круг
                </button>
                {!isRunning ? (
                    <button onClick={handleStart}>Старт</button>
                ) : (
                    <button onClick={handleStop}>Стоп</button>
                )}
                <button onClick={handleReset}>Сброс</button>
            </div>

            {/* Список кругов */}
            {laps.length > 0 && (
                <div className="laps-container">
                    <h3>Результат:</h3>
                    <div className="laps-list">
                        {laps.map((lap, index) => (
                            <div key={lap.id} className="lap-item">
                                <span className="lap-time">Круг {laps.length - index}: {lap.time}</span>
                                <button
                                    onClick={() => handleDeleteLap(lap.id)}
                                    className="delete-lap-btn"
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Timer;