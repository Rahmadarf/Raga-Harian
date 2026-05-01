
interface DashboardContextType {
    user: UserType | null,
    health: HealthType | null,
    weather: WeatherType | null,
    waterToday: number,
    patients: any
    role: any
    waterStatus: WaterStatusType,
    dynamicTarget: number,
    loading: boolean,
    refreshAll: () => Promise<void>,
    addWater: (amount: number) => Promise<void>
}

interface UserType {
    id: string,
    fullName: string,
    firstName: string,
    lastName: string,
    age: number,
}

interface HealthType {
    bmi: number,
    weight_kg: number,
    height_cm: number,
    target_weight: number,
    added: {
        label: string,
        bg: string,
        text: string,
        border: string,
        info: string,
    }
}

interface WeatherType {
    city: string,
    current: {
        temp: number,
        icon: string,
        desc: string,
        humidity: number,
        wind: number,
        uvi: {
            label: string,
            color: string,
            bg: string,
            border: string,
            added: string,
        }
    }
}

interface WaterStatusType {
    label: string;
    sub: string;
    bg: string;
    border: string;
    text: string;
    icon: string;
}