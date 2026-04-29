
export interface DashboardContextType {
    user: UserType | null,
    health: HealthType | null,
    weather: WeatherType | null,
    waterToday: number,
    waterStatus: WaterStatusType,
    dynamicTarget: number,
    loading: boolean,
    refreshAll: () => Promise<void>,
    addWater: (amount: number) => Promise<void>
}

export interface UserType {
    id: string,
    fullName: string,
    firstName: string,
    lastName: string,
    age: number,
}

export interface HealthType {
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

export interface WeatherType {
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

export interface WaterStatusType {
    label: string;
    sub: string;
    bg: string;
    border: string;
    text: string;
    icon: string;
}