import "../styles/Nutrition.css"
import { useState, useEffect } from 'react';
import localforage from 'localforage';

interface NutritionData {
    gender: string;
    age: number;
    weight: number;
    goal: string;
    targetWeight: number;
    height: number;
    activityLevel: string;
}

interface CalculationResult {
    bmr: number;
    maintenanceCalories: number;
    targetCalories: number;
    protein: number;
    fat: number;
    carbs: number;
    activityMultiplier: number;
}

interface FormErrors {
    gender?: string;
    age?: string;
    weight?: string;
    goal?: string;
    targetWeight?: string;
    height?: string;
    activityLevel?: string;
}

const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extreme: 1.9
};

function Nutrition() {
    const [formData, setFormData] = useState<NutritionData>({
        gender: '',
        age: 0,
        weight: 0,
        goal: '',
        targetWeight: 0,
        height: 0,
        activityLevel: 'moderate'
    });

    const [result, setResult] = useState<CalculationResult | null>(null);
    const [quote, setQuote] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});

    const quotes = [
        "Сначала ты решил пропустить тренировку, а потом попьешь раф на хуесосовом молоке...",
        "Завтра начну... а пока можно и пончик!",
        "Почему когда программист вставил палец в жопу, то сказал что так нормально??? Потому что до этого там был костыль...",
        "Нет боли - нет роста. Но если больно слишком - может, стоит вынуть анальную пробку?",
        "Пропустил одну тренировку, потом вторую... а там уже и в гей клуб сходи!",
        "Ты надеешься что-то умное увидеть тут...?",
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedData = await localforage.getItem<NutritionData>('nutritionData');
                const savedResult = await localforage.getItem<CalculationResult>('nutritionResult');

                if (savedData) {
                    setFormData(savedData);
                }
                if (savedResult) {
                    setResult(savedResult);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            try {
                await localforage.setItem('nutritionData', formData);
                if (result) {
                    await localforage.setItem('nutritionResult', result);
                }
            } catch (error) {
                console.error('Error saving data:', error);
            }
        };

        saveData();
    }, [formData, result]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        const numericValue = ['age', 'weight', 'targetWeight', 'height'].includes(name)
            ? parseInt(value) || 0
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.gender) newErrors.gender = 'Выберите пол';
        if (!formData.age || formData.age < 10 || formData.age > 70) newErrors.age = 'Возраст от 10 до 70';
        if (!formData.weight || formData.weight < 40 || formData.weight > 150) newErrors.weight = 'Вес от 40 до 150 кг';
        if (!formData.goal) newErrors.goal = 'Выберите цель';
        if (!formData.targetWeight) newErrors.targetWeight = 'Введите желаемый вес';
        if (!formData.height || formData.height < 100 || formData.height > 250) newErrors.height = 'Рост от 100 до 250 см';
        if (!formData.activityLevel) newErrors.activityLevel = 'Выберите уровень активности';

        if (formData.targetWeight && formData.weight && formData.goal) {
            const difference = formData.targetWeight - formData.weight;

            if (formData.goal === 'gain' && difference <= 0) {
                newErrors.targetWeight = 'Для набора веса желаемый вес должен быть больше текущего';
            } else if (formData.goal === 'lose' && difference >= 0) {
                newErrors.targetWeight = 'Для похудения желаемый вес должен быть меньше текущего';
            } else if (Math.abs(difference) > 30) {
                newErrors.targetWeight = 'Разница не должна превышать 30 кг';
            }

            if (formData.goal === 'gain' && formData.targetWeight < 40) {
                newErrors.targetWeight = 'Минимальный вес 40 кг';
            } else if (formData.goal === 'lose' && formData.targetWeight > 150) {
                newErrors.targetWeight = 'Максимальный вес 150 кг';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateNutrition = () => {
        if (!validateForm()) return;

        let bmr: number;
        if (formData.gender === 'male') {
            bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
        } else {
            bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161;
        }

        const activityMultiplier = ACTIVITY_MULTIPLIERS[formData.activityLevel as keyof typeof ACTIVITY_MULTIPLIERS] || 1.55;
        const maintenanceCalories = bmr * activityMultiplier;

        let targetCalories: number;
        if (formData.goal === 'gain') {
            targetCalories = maintenanceCalories * 1.15;
        } else {
            targetCalories = maintenanceCalories * 0.85;
        }

        const protein = formData.goal === 'gain' ? 2 * formData.weight : 1.6 * formData.weight;
        const fat = 1.2 * formData.weight;
        const proteinCalories = protein * 4;
        const fatCalories = fat * 9;
        const carbCalories = targetCalories - proteinCalories - fatCalories;
        const carbs = carbCalories / 4;

        const calculationResult: CalculationResult = {
            bmr: Math.round(bmr),
            maintenanceCalories: Math.round(maintenanceCalories),
            targetCalories: Math.round(targetCalories),
            protein: Math.round(protein),
            fat: Math.round(fat),
            carbs: Math.round(carbs),
            activityMultiplier: activityMultiplier
        };

        setResult(calculationResult);
    };

    const resetForm = () => {
        setFormData({
            gender: '',
            age: 0,
            weight: 0,
            goal: '',
            targetWeight: 0,
            height: 0,
            activityLevel: 'moderate'
        });
        setResult(null);
        setQuote('');
        localforage.removeItem('nutritionData');
        localforage.removeItem('nutritionResult');
    };

    const getRandomQuote = () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    };

    const getActivityDescription = () => {
        switch (formData.activityLevel) {
            case 'sedentary': return 'Сидячий образ жизни (мало или нет физических нагрузок)';
            case 'light': return 'Легкая активность (легкие упражнения 1-3 дня в неделю)';
            case 'moderate': return 'Умеренная активность (умеренные упражнения 3-5 дней в неделю)';
            case 'active': return 'Высокая активность (тяжелые упражнения 6-7 дней в неделю)';
            case 'extreme': return 'Экстремальная активность (тяжелые тренировки, физическая работа)';
            default: return '';
        }
    };

    return (
        <div className="nutrition-container">
            <h1>Ну чё, скотобаза, Я твой диетолог!</h1>
            <p>Заполни форму и не ленись выполнять!</p>

            <form>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужчина</option>
                    <option value="female">Женщина</option>
                </select>
                {errors.gender && <span className="error">{errors.gender}</span>}

                <select
                    name="age"
                    value={formData.age || ''}
                    onChange={handleInputChange}
                >
                    <option value="">Выберите возраст</option>
                    {Array.from({ length: 61 }, (_, i) => i + 10).map(age => (
                        <option key={age} value={age}>{age}</option>
                    ))}
                </select>
                {errors.age && <span className="error">{errors.age}</span>}

                <select
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleInputChange}
                >
                    <option value="">Выберите вес</option>
                    {Array.from({ length: 111 }, (_, i) => i + 40).map(weight => (
                        <option key={weight} value={weight}>{weight} кг</option>
                    ))}
                </select>
                {errors.weight && <span className="error">{errors.weight}</span>}

                <input
                    type="number"
                    name="height"
                    value={formData.height || ''}
                    onChange={handleInputChange}
                    placeholder="Рост в см"
                    min="100"
                    max="250"
                />
                {errors.height && <span className="error">{errors.height}</span>}

                <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                >
                    <option value="sedentary">Сидячий образ жизни</option>
                    <option value="light">Легкая активность</option>
                    <option value="moderate">Умеренная активность</option>
                    <option value="active">Высокая активность</option>
                    <option value="extreme">Экстремальная активность</option>
                </select>
                {errors.activityLevel && <span className="error">{errors.activityLevel}</span>}
                <small>{getActivityDescription()}</small>

                <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                >
                    <option value="">Выберите цель</option>
                    <option value="gain">Набрать вес</option>
                    <option value="lose">Похудеть</option>
                </select>
                {errors.goal && <span className="error">{errors.goal}</span>}

                <input
                    type="number"
                    name="targetWeight"
                    value={formData.targetWeight || ''}
                    onChange={handleInputChange}
                    placeholder="Сколько хочешь весить?"
                    min={formData.goal === 'lose' ? 40 : (formData.weight || 40)}
                    max={formData.goal === 'gain' ? 150 : (formData.weight || 150)}
                />
                {errors.targetWeight && <span className="error">{errors.targetWeight}</span>}

                <button type="button" onClick={calculateNutrition}>Посчитай</button>
                <button type="button" onClick={resetForm}>Сбросить</button>
            </form>

            {result && (
                <>
                    <div className="laps-container">
                        <h2>Результат подсчета:</h2>
                        <p>
                            Формула Миффлина-Сан Жеора ({formData.gender === 'male' ? 'для мужчин' : 'для женщин'}):<br />
                            BMR = 10 × {formData.weight} + 6.25 × {formData.height} - 5 × {formData.age}
                            {formData.gender === 'male' ? ' + 5' : ' - 161'} = {result.bmr} ккал<br /><br />

                            Умножим на коэффициент активности ({result.activityMultiplier} - {getActivityDescription()}):<br />
                            Поддержание веса = {result.bmr} × {result.activityMultiplier} ≈ {result.maintenanceCalories} ккал<br /><br />

                            {formData.goal === 'gain' ? 'Для набора веса добавляем 15%:' : 'Для похудения убавляем 15%:'}<br />
                            {formData.goal === 'gain'
                                ? `${result.maintenanceCalories} + 15% ≈ ${result.targetCalories} ккал`
                                : `${result.maintenanceCalories} - 15% ≈ ${result.targetCalories} ккал`
                            }<br /><br />

                            Итог: ≈ {result.targetCalories} ккал/день
                        </p>
                    </div>

                    <div className="laps-container">
                        <h2>Рекомендации по БЖУ:</h2>
                        <p>
                            Оптимальное соотношение для {formData.goal === 'gain' ? 'набора мышечной массы' : 'похудения'}:<br />
                            - Белки: {formData.goal === 'gain' ? '2.0' : '1.6'} г на кг веса = {result.protein} г (≈ {result.protein * 4} ккал)<br />
                            - Жиры: 1.2 г на кг веса = {result.fat} г (≈ {result.fat * 9} ккал)<br />
                            - Углеводы: ({result.targetCalories} - {result.protein * 4} - {result.fat * 9}) / 4 ≈ {result.carbs} г<br /><br />

                            Итоговое БЖУ в день:<br />
                            - {result.targetCalories} ккал<br />
                            - Белки: {result.protein} г<br />
                            - Жиры: {result.fat} г<br />
                            - Углеводы: {result.carbs} г
                        </p>
                    </div>

                    <div className="laps-container">
                        <h2>Полезные Советы:</h2>
                        <p>Самое главное не пизди тренеру что не пропускаешь треню, а в остальном:</p>

                        {formData.goal === 'gain' ? (
                            <>
                                ✅ Профицит калорий – ешь больше, чем тратишь но не резко +500 ккал, а плавно.<br />
                                ✅ Акцент на белок – курица, рыба, яйца, творог, протеин если сложно добирать.<br />
                                ✅ Полезные жиры – орехи, авокадо, оливковое масло, жирная рыба.<br />
                                ✅ Сложные углеводы – гречка, овсянка, рис, макароны из твердых сортов.<br />
                                ✅ Силовые тренировки – без них вес будет расти за счет жира, а не мышц.<br />
                                ❌ Не налегай на фастфуд – лучше качественная калорийная пища орехи, сухофрукты, мясо, крупы.<br /><br />

                                Контроль прогресса:<br />
                                - Взвешивайся раз в неделю утром натощак.<br />
                                - Прибавка 0.3–0.5 кг в неделю – хороший темп.<br />
                                - Если вес не растет, добавляй +200–300 ккал.
                            </>
                        ) : (
                            <>
                                ✅ Дефицит калорий – ешь меньше, чем тратишь, но не менее 1200 ккал в день.<br />
                                ✅ Высокий белок – сохраняет мышцы при похудении, 1.6-2.2 г на кг веса.<br />
                                ✅ Полезные жиры – поддерживают гормональный фон, не исключай полностью.<br />
                                ✅ Сложные углеводы – дают энергию и насыщение.<br />
                                ✅ Кардио + силовые – оптимальное сочетание для жиросжигания.<br />
                                ❌ Не голодай – это замедляет метаболизм и ведет к срывам.<br /><br />

                                Контроль прогресса:<br />
                                - Взвешивайся раз в неделю утром натощак.<br />
                                - Снижение 0.5–1 кг в неделю – безопасный темп.<br />
                                - Если вес стоит на месте, пересмотри питание и активность.
                            </>
                        )}
                    </div>
                </>
            )}

            <div className="laps-container">
                <button onClick={getRandomQuote}>Получить цитату дня</button>
                {quote && <p>{quote}</p>}
            </div>

          

        </div>
    );
}

export default Nutrition;